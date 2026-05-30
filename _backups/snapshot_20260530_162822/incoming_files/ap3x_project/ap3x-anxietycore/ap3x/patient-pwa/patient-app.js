// AP3X AnxietyCore — Patient PWA App Entry
// ─────────────────────────────────────────────────────────────────
// Bootstraps the PWA, wires UI to the AnxietyCore service layer.
// Architecture: UI dispatches events only — never writes storage directly.

import { initPWA }           from "../../bco/pwa/pwa.js";
import { initSystem }        from "../../bco/core/init.js";
import { moduleRegistry }    from "../../bco/core/modules.js";
import { anxietyCoreModule } from "../anxietycore/module/anxietycore.module.js";
import {
  submitAnxietyCheckin,
  submitMoodLog,
  submitSleepLog,
  submitTriggerLog,
  getAnxietyHistory,
  getMoodHistory
} from "../anxietycore/module/checkin-service.js";
import { getStreak }       from "../anxietycore/module/streak-tracker.js";
import { attachNetworkListener, getPendingCount }
  from "../shared/sync-service.js";
import { DISCLAIMER }      from "../shared/constants.js";
import { createAnxietyChart } from "./chart.js";

// ── Boot ──────────────────────────────────────────────────────────
(async function boot() {
  // 1. Init BCO SSOT (localStorage mode for PWA)
  initSystem({ mode: "LOCAL", tenantId: "ap3x-patient" });

  // 2. Register AnxietyCore module with BCO module registry
  moduleRegistry.register(anxietyCoreModule);

  // 3. Init BCO PWA shell (service worker, push, reconnect sync)
  await initPWA();

  // 4. Attach network sync listener
  attachNetworkListener();

  // 5. Resolve user ID (stub — replace with your auth layer)
  const userId = _getOrCreateUserId();

  // 6. Render UI
  renderDisclaimer();
  renderStreak(userId);
  renderSyncBadge();
  renderHistory(userId);
  renderTriggerList(userId);

  // 7. Wire up UI events
  wireNav();
  wireAnxietyScale();
  wireCheckinSubmit(userId);
  wireMoodTags();
  wireExercises();
  wireTriggerSubmit(userId);
  wireEmergency();
  wireThemeToggle();

  // 8. Update sync badge every 30s
  setInterval(() => renderSyncBadge(), 30_000);

  console.log("[AP3X] Patient PWA booted.");
})();

// ── Navigation ────────────────────────────────────────────────────
function wireNav() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-page").forEach((p) => p.classList.add("hidden"));
      tab.classList.add("active");
      document.getElementById(`tab-${target}`)?.classList.remove("hidden");
    });
  });
}

// ── Anxiety scale ─────────────────────────────────────────────────
let _selectedScore = null;

function wireAnxietyScale() {
  const track = document.getElementById("anxiety-scale");
  const display = document.getElementById("score-display");

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.className = "scale-btn";
    btn.dataset.val = String(i);
    btn.textContent = String(i);
    btn.addEventListener("click", () => {
      _selectedScore = i;
      track.querySelectorAll(".scale-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      display.textContent = String(i);
    });
    track.appendChild(btn);
  }
}

// ── Mood tags ─────────────────────────────────────────────────────
function wireMoodTags() {
  document.querySelectorAll("#mood-tags .tag").forEach((tag) => {
    tag.addEventListener("click", () => tag.classList.toggle("active"));
  });
}

function _getActiveTags() {
  return [...document.querySelectorAll("#mood-tags .tag.active")]
    .map((t) => t.dataset.tag);
}

// ── Check-in submit ───────────────────────────────────────────────
function wireCheckinSubmit(userId) {
  document.getElementById("submit-checkin").addEventListener("click", () => {
    if (_selectedScore === null) {
      _showToast("Please select your anxiety level (0–10).");
      return;
    }

    const sleepVal = document.getElementById("sleep-input").value;
    const moodText = document.getElementById("mood-input").value.trim();
    const tags     = _getActiveTags();
    const sleepHrs = sleepVal !== "" ? parseFloat(sleepVal) : undefined;

    const { record, streak, entryResult, trendResult } = submitAnxietyCheckin({
      userId,
      anxiety_score: _selectedScore,
      note: moodText,
      sleep_hours: sleepHrs
    });

    // Log mood if text entered
    if (moodText) {
      submitMoodLog({ userId, mood_text: moodText, tags });
    }

    // Log sleep if provided
    if (sleepHrs !== undefined) {
      submitSleepLog({ userId, hours: sleepHrs });
    }

    // Show feedback
    _showFeedback(entryResult, trendResult);

    // Refresh UI
    renderStreak(userId);
    renderSyncBadge();
    renderHistory(userId);

    // Reset form
    _resetCheckinForm();
  });
}

function _showFeedback(entryResult, trendResult) {
  const card   = document.getElementById("feedback-card");
  const badge  = document.getElementById("feedback-risk-badge");
  const suggs  = document.getElementById("feedback-suggestions");

  const finalRisk = [entryResult.risk, trendResult.risk]
    .sort((a, b) => _riskOrder(b) - _riskOrder(a))[0];

  const allSuggestions = [
    ...entryResult.suggestions,
    ...trendResult.suggestions
  ];

  badge.className = `risk-badge ${finalRisk}`;
  badge.textContent = finalRisk === "LOW" ? "You're doing well" : finalRisk;
  suggs.textContent = allSuggestions.join(" ") || "Keep going — check in again tomorrow!";

  card.classList.remove("hidden");
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function _riskOrder(risk) {
  return { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3, MISSING_DATA: 0 }[risk] ?? 0;
}

function _resetCheckinForm() {
  _selectedScore = null;
  document.getElementById("score-display").textContent = "–";
  document.querySelectorAll(".scale-btn").forEach((b) => b.classList.remove("selected"));
  document.getElementById("mood-input").value = "";
  document.getElementById("sleep-input").value = "";
  document.querySelectorAll("#mood-tags .tag").forEach((t) => t.classList.remove("active"));
}

// ── Streak display ────────────────────────────────────────────────
function renderStreak(userId) {
  const banner = document.getElementById("streak-banner");
  const text   = document.getElementById("streak-text");
  const streak = getStreak(userId);

  if (streak.current > 0) {
    text.textContent = `${streak.current} day streak`;
    banner.classList.remove("hidden");
  }
}

// ── Sync badge ────────────────────────────────────────────────────
function renderSyncBadge() {
  const count = getPendingCount();
  const badge = document.getElementById("sync-count");
  if (count > 0) {
    badge.textContent = String(count);
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

// ── History tab ───────────────────────────────────────────────────
function renderHistory(userId) {
  const logs = getAnxietyHistory(userId, 30);
  const list = document.getElementById("history-list");

  if (logs.length === 0) {
    list.innerHTML = `<p class="empty-state">No check-ins yet. Start your first one!</p>`;
    return;
  }

  list.innerHTML = logs.map((entry) => {
    const bg = _scoreBg(entry.anxiety_score);
    return `
      <div class="history-item">
        <div class="history-score" style="background:${bg.bg};color:${bg.color}">
          ${entry.anxiety_score}
        </div>
        <div class="history-meta">
          <div class="history-date">${_fmtDate(entry.created_at)}</div>
          ${entry.note ? `<div class="history-note">${_esc(entry.note)}</div>` : ""}
        </div>
      </div>
    `;
  }).join("");

  // Render mini chart
  const chartData = logs.slice().reverse().map((e) => e.anxiety_score);
  createAnxietyChart("anxiety-chart", chartData);
}

function _scoreBg(score) {
  if (score <= 3) return { bg: "#d1fae5", color: "#065f46" };
  if (score <= 5) return { bg: "#fef9c3", color: "#713f12" };
  if (score <= 7) return { bg: "#fed7aa", color: "#7c2d12" };
  return { bg: "#fecaca", color: "#7f1d1d" };
}

// ── Trigger list ──────────────────────────────────────────────────
function wireTriggerSubmit(userId) {
  const sevSlider = document.getElementById("trigger-severity");
  const sevVal    = document.getElementById("trigger-severity-val");

  sevSlider.addEventListener("input", () => {
    sevVal.textContent = sevSlider.value;
  });

  document.getElementById("submit-trigger").addEventListener("click", () => {
    const name = document.getElementById("trigger-name").value.trim();
    if (!name) { _showToast("Enter a trigger name."); return; }

    submitTriggerLog({
      userId,
      trigger_name: name,
      description: document.getElementById("trigger-desc").value.trim(),
      severity: parseInt(sevSlider.value, 10)
    });

    document.getElementById("trigger-name").value = "";
    document.getElementById("trigger-desc").value = "";
    sevSlider.value = "5";
    sevVal.textContent = "5";
    renderTriggerList(userId);
    _showToast("Trigger logged ✓");
  });
}

function renderTriggerList(userId) {
  const { storage } = window._ap3xStorage || {};
  // Pull directly from BCO storage if available
  // Fallback: re-import at module level
}

// ── Exercises ─────────────────────────────────────────────────────
const EXERCISES = {
  "478": {
    name: "4-7-8 Breathing",
    steps: [
      { label: "Inhale", class: "inhale",  duration: 4000 },
      { label: "Hold",   class: "hold",    duration: 7000 },
      { label: "Exhale", class: "exhale",  duration: 8000 }
    ],
    cycles: 4
  },
  "box": {
    name: "Box Breathing",
    steps: [
      { label: "Inhale", class: "inhale", duration: 4000 },
      { label: "Hold",   class: "hold",   duration: 4000 },
      { label: "Exhale", class: "exhale", duration: 4000 },
      { label: "Hold",   class: "hold",   duration: 4000 }
    ],
    cycles: 4
  },
  "54321": {
    name: "5-4-3-2-1 Grounding",
    steps: [
      { label: "Notice 5 things you can SEE",   class: "inhale",  duration: 6000 },
      { label: "Notice 4 things you can TOUCH", class: "hold",    duration: 6000 },
      { label: "Notice 3 things you can HEAR",  class: "exhale",  duration: 6000 },
      { label: "Notice 2 things you can SMELL", class: "inhale",  duration: 6000 },
      { label: "Notice 1 thing you can TASTE",  class: "exhale",  duration: 6000 }
    ],
    cycles: 1
  },
  "recovery": {
    name: "Recovery Mode",
    steps: [
      { label: "Breathe in slowly…",           class: "inhale",  duration: 5000 },
      { label: "Hold gently…",                 class: "hold",    duration: 3000 },
      { label: "Let it all go…",               class: "exhale",  duration: 7000 },
      { label: "You are safe. You are here.",  class: "hold",    duration: 4000 }
    ],
    cycles: 5
  }
};

let _exerciseTimer = null;

function wireExercises() {
  document.querySelectorAll(".btn-start-exercise").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".exercise-card").dataset.exercise;
      startExercise(id);
    });
  });

  document.getElementById("runner-stop").addEventListener("click", stopExercise);
}

function startExercise(id) {
  const ex = EXERCISES[id];
  if (!ex) return;
  const runner = document.getElementById("exercise-runner");
  runner.classList.remove("hidden");
  _runExerciseCycles(ex, 0, 0);
}

async function _runExerciseCycles(ex, cycleIdx, stepIdx) {
  if (cycleIdx >= ex.cycles) {
    document.getElementById("runner-instruction").textContent = "Well done 🌿";
    document.getElementById("runner-step").textContent = "";
    setTimeout(stopExercise, 2000);
    return;
  }

  const step   = ex.steps[stepIdx];
  const circle = document.getElementById("breath-circle");
  const instr  = document.getElementById("runner-instruction");
  const stepEl = document.getElementById("runner-step");

  circle.className = `breath-circle ${step.class}`;
  instr.textContent = step.label;
  stepEl.textContent = `Cycle ${cycleIdx + 1} of ${ex.cycles}`;

  _exerciseTimer = setTimeout(() => {
    const nextStep = stepIdx + 1;
    if (nextStep >= ex.steps.length) {
      _runExerciseCycles(ex, cycleIdx + 1, 0);
    } else {
      _runExerciseCycles(ex, cycleIdx, nextStep);
    }
  }, step.duration);
}

function stopExercise() {
  clearTimeout(_exerciseTimer);
  document.getElementById("exercise-runner").classList.add("hidden");
  document.getElementById("breath-circle").className = "breath-circle";
}

// ── Emergency ─────────────────────────────────────────────────────
function wireEmergency() {
  document.getElementById("emergency-btn").addEventListener("click", () => {
    document.getElementById("emergency-modal").classList.remove("hidden");
  });
  document.getElementById("close-emergency").addEventListener("click", () => {
    document.getElementById("emergency-modal").classList.add("hidden");
  });

  // Emergency contact link — configurable via storage or query param
  const params    = new URLSearchParams(location.search);
  const contactHref = params.get("emergency_contact") || "tel:999";
  document.getElementById("emergency-contact-link").href = contactHref;
}

// ── Theme toggle ──────────────────────────────────────────────────
function wireThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("ap3x_theme") || "light";
  _applyTheme(saved);
  btn.addEventListener("click", () => {
    const current = document.body.dataset.theme === "dark" ? "light" : "dark";
    _applyTheme(current);
    localStorage.setItem("ap3x_theme", current);
  });
}

function _applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.getElementById("theme-toggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

// ── Disclaimer ────────────────────────────────────────────────────
function renderDisclaimer() {
  document.getElementById("disclaimer-text").textContent = DISCLAIMER;
}

// ── Helpers ───────────────────────────────────────────────────────
function _getOrCreateUserId() {
  let id = localStorage.getItem("ap3x_user_id");
  if (!id) {
    id = "u_" + crypto.randomUUID();
    localStorage.setItem("ap3x_user_id", id);
  }
  return id;
}

function _showToast(message) {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position:fixed; bottom:90px; left:50%; transform:translateX(-50%);
    background:#1e293b; color:white; padding:10px 18px; border-radius:8px;
    font-size:14px; z-index:500; animation:fadeIn 0.2s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function _fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

function _esc(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
