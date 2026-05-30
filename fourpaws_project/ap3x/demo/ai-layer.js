/* ═══════════════════════════════════════════════════════════════
   FOUR PAWS TRAINING & ENRICHMENT ACADEMY
   ai-layer.js — Derived Intelligence Only

   INPUT:  Data from FP_STORE (storage.js)
   OUTPUT: Risk scores, engagement, struggle detection, insights

   RULES:
   - Does NOT store data
   - Does NOT replace storage.js
   - Does NOT call external APIs
   - Only analyses and returns derived insight objects
═══════════════════════════════════════════════════════════════ */

const FP_AI = (function () {

  /* ─────────────────────────────────────────────────────────
     ENGAGEMENT SCORE
     0–100. Based on: session frequency, lesson pace, streak.
  ─────────────────────────────────────────────────────────── */
  function calcEngagement(sessions, streak, lessonsDone) {
    const now = Date.now();
    const DAY = 86400000;

    // Session frequency — sessions in last 7 days (max 40pts)
    const recentSessions = sessions.filter(s => (now - (s.ts || 0)) < 7 * DAY);
    const freqScore = Math.min(recentSessions.length / 5 * 40, 40);

    // Streak (max 30pts)
    const streakScore = Math.min(streak / 7 * 30, 30);

    // Lesson progress (max 30pts)
    const totalLessons = typeof FP_STORE !== 'undefined'
      ? FP_STORE.getAllLessons().length
      : 20;
    const lessonScore = Math.min(lessonsDone / totalLessons * 30, 30);

    return Math.round(freqScore + streakScore + lessonScore);
  }

  /* ─────────────────────────────────────────────────────────
     RISK SCORE
     LOW / MEDIUM / HIGH
     Based on: inactivity, session quality decline, streak drop.
  ─────────────────────────────────────────────────────────── */
  function calcRisk(sessions, streak, lessonsDone) {
    const now = Date.now();
    const DAY = 86400000;

    const daysSinceLastSession = sessions.length > 0
      ? Math.floor((now - (sessions[0].ts || 0)) / DAY)
      : 999;

    // High: no session in 7+ days
    if (daysSinceLastSession >= 7) return 'HIGH';

    // High: zero streak and lessons stalled
    if (streak === 0 && lessonsDone === 0) return 'HIGH';

    // Medium: 3–6 days inactive
    if (daysSinceLastSession >= 3) return 'MEDIUM';

    // Medium: last 3 sessions declining scores
    if (sessions.length >= 3) {
      const recent = sessions.slice(0, 3).map(s => s.score || 0);
      const declining = recent[0] < recent[1] && recent[1] < recent[2];
      if (declining) return 'MEDIUM';
    }

    return 'LOW';
  }

  /* ─────────────────────────────────────────────────────────
     STRUGGLE DETECTION
     Returns array of struggle signals.
  ─────────────────────────────────────────────────────────── */
  function detectStruggles(sessions, completedLessonIds) {
    const signals = [];
    const DAY = 86400000;
    const now = Date.now();

    // Low average session score
    if (sessions.length >= 3) {
      const avg = sessions.slice(0, 5).reduce((s, x) => s + (x.score || 0), 0) / Math.min(sessions.length, 5);
      if (avg < 4) signals.push({ type: 'LOW_SCORE', msg: 'Average session score below 4/10 — review training environment or plan simplification' });
    }

    // Same lesson not completed after 5+ sessions
    if (typeof FP_STORE !== 'undefined') {
      const nextLesson = FP_STORE.getNextLesson();
      const lastCompletedTs = sessions.length > 0 ? sessions[0].ts : 0;
      const stuckDays = nextLesson ? Math.floor((now - lastCompletedTs) / DAY) : 0;
      if (stuckDays >= 5 && completedLessonIds.length > 0) {
        signals.push({ type: 'STUCK_LESSON', msg: `No lesson progress in ${stuckDays} days — owner may need extra support or simpler homework` });
      }
    }

    // Repeated HIGH_DISTRACTION context
    const distractionCount = sessions.filter(s => s.context && s.context.includes('High Distraction')).length;
    if (distractionCount >= 3) {
      signals.push({ type: 'DISTRACTION_PATTERN', msg: 'Repeated high-distraction context — recommend reducing environment difficulty' });
    }

    return signals;
  }

  /* ─────────────────────────────────────────────────────────
     DROP-OFF DETECTION
  ─────────────────────────────────────────────────────────── */
  function detectDropOff(sessions, streak) {
    const DAY = 86400000;
    const now = Date.now();

    const daysSinceLast = sessions.length > 0
      ? Math.floor((now - (sessions[0].ts || 0)) / DAY)
      : 999;

    if (daysSinceLast >= 14) return { risk: 'CRITICAL', msg: `${daysSinceLast} days since last session — immediate re-engagement needed` };
    if (daysSinceLast >= 7)  return { risk: 'HIGH',     msg: `${daysSinceLast} days since last session — send check-in message` };
    if (daysSinceLast >= 4)  return { risk: 'MEDIUM',   msg: `${daysSinceLast} days since last session — owner may be struggling` };
    return null;
  }

  /* ─────────────────────────────────────────────────────────
     BEHAVIOUR TREND SUMMARY
     Returns a plain-language summary string.
  ─────────────────────────────────────────────────────────── */
  function trendSummary(sessions, streak, engagement, risk) {
    if (sessions.length === 0) {
      return 'No session data yet. Encourage the owner to complete their first session log.';
    }

    const recentScores = sessions.slice(0, 5).map(s => s.score || 0).filter(Boolean);
    const avg = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;

    const trend = recentScores.length >= 2
      ? recentScores[0] > recentScores[recentScores.length - 1] ? 'improving'
      : recentScores[0] < recentScores[recentScores.length - 1] ? 'declining'
      : 'stable'
      : 'too early to trend';

    const engLabel = engagement >= 70 ? 'high' : engagement >= 40 ? 'moderate' : 'low';

    return `${sessions.length} sessions logged. Average score ${avg.toFixed(1)}/10 — trend is ${trend}. Engagement is ${engLabel} (${engagement}%). Streak: ${streak} day${streak !== 1 ? 's' : ''}.`;
  }

  /* ─────────────────────────────────────────────────────────
     SUGGESTED TRAINER ACTIONS
     Returns array of action strings derived from data.
  ─────────────────────────────────────────────────────────── */
  function suggestedActions(risk, struggles, dropOff, engagement, streak, sessions) {
    const actions = [];

    if (dropOff && dropOff.risk === 'CRITICAL') {
      actions.push('📞 Phone call recommended — owner unresponsive for 14+ days');
    } else if (dropOff && dropOff.risk === 'HIGH') {
      actions.push('📧 Send re-engagement message with a simple homework task');
    }

    if (risk === 'HIGH' && streak === 0) {
      actions.push('🔔 Assign a new, easier lesson to rebuild momentum');
    }

    if (engagement < 30) {
      actions.push('💬 Schedule a 10-min check-in call to understand barriers');
    }

    struggles.forEach(s => {
      if (s.type === 'LOW_SCORE')           actions.push('📋 Review training plan — simplify the current lesson');
      if (s.type === 'STUCK_LESSON')        actions.push('🎓 Check if owner understands homework — offer video demo');
      if (s.type === 'DISTRACTION_PATTERN') actions.push('🌿 Recommend indoor-only sessions until focus improves');
    });

    if (actions.length === 0 && engagement >= 70) {
      actions.push('⭐ Owner is engaged and progressing well — consider advancing to next module');
    }

    if (actions.length === 0) {
      actions.push('✅ No immediate action required — continue monitoring');
    }

    return actions;
  }

  /* ─────────────────────────────────────────────────────────
     MAIN ANALYSE FUNCTION
     Call with storage data. Returns insight object.
  ─────────────────────────────────────────────────────────── */
  function analyse(storageData) {
    const sessions          = storageData.sessions       || [];
    const completedLessons  = storageData.completedLessons || [];
    const streak            = storageData.streak         || 0;

    const engagement  = calcEngagement(sessions, streak, completedLessons.length);
    const risk        = calcRisk(sessions, streak, completedLessons.length);
    const struggles   = detectStruggles(sessions, completedLessons);
    const dropOff     = detectDropOff(sessions, streak);
    const trend       = trendSummary(sessions, streak, engagement, risk);
    const actions     = suggestedActions(risk, struggles, dropOff, engagement, streak, sessions);

    return {
      riskLevel:     risk,           // 'LOW' | 'MEDIUM' | 'HIGH'
      engagementScore: engagement,   // 0–100
      struggles,                     // [{ type, msg }]
      dropOff,                       // null | { risk, msg }
      trendSummary:  trend,          // string
      suggestedActions: actions,     // string[]
    };
  }

  /* ─────────────────────────────────────────────────────────
     ACADEMY-WIDE AGGREGATE (for trainer overview)
     Accepts array of individual insight objects + dog metadata.
  ─────────────────────────────────────────────────────────── */
  function aggregateAcademy(dogInsights) {
    if (!dogInsights || !dogInsights.length) {
      return { avgEngagement: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, totalAlerts: 0, dropOffs: 0 };
    }
    const total = dogInsights.length;
    const high   = dogInsights.filter(d => d.riskLevel === 'HIGH').length;
    const medium = dogInsights.filter(d => d.riskLevel === 'MEDIUM').length;
    const low    = dogInsights.filter(d => d.riskLevel === 'LOW').length;
    const avgEng = Math.round(dogInsights.reduce((s, d) => s + d.engagementScore, 0) / total);
    const alerts = dogInsights.reduce((s, d) => s + d.struggles.length + (d.dropOff ? 1 : 0), 0);
    const drops  = dogInsights.filter(d => d.dropOff).length;

    return {
      avgEngagement: avgEng,
      highRisk: high,
      mediumRisk: medium,
      lowRisk: low,
      totalAlerts: alerts,
      dropOffs: drops,
    };
  }

  return { analyse, aggregateAcademy };

})();

if (typeof window !== 'undefined') window.FP_AI = FP_AI;
