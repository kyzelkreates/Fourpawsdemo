// ═══════════════════════════════════════════════════════
//  FOUR PAWS ACADEMY — INTELLIGENT TRAINING COMPANION
//  PWA Application Logic
// ═══════════════════════════════════════════════════════

// ── State ──────────────────────────────────────────────
const APP = {
  sessions: JSON.parse(localStorage.getItem('fp_sessions') || '[]'),
  streak: parseInt(localStorage.getItem('fp_streak') || '0'),
  xp: parseInt(localStorage.getItem('fp_xp') || '0'),
  dogName: localStorage.getItem('fp_dog_name') || 'Your Dog',
  currentModule: parseInt(localStorage.getItem('fp_module') || '1'),
  completedActivities: JSON.parse(localStorage.getItem('fp_completed_acts') || '[]'),
  milestones: JSON.parse(localStorage.getItem('fp_milestones') || '[]'),
  selectedScore: null,
  selectedSkills: [],
  selectedFocus: [],
};

// ── Demo sessions (pre-seeded so charts look real) ────
if (!APP.sessions.length) {
  const now = Date.now();
  const D = 86400000;
  APP.sessions = [
    {date:now-D*13,score:5,skills:['Sit / Down','Recall'],focus:['Easily distracted'],duration:8,note:'First session — very excited!'},
    {date:now-D*12,score:4,skills:['Sit / Down'],focus:['Easily distracted'],duration:6,note:'Sit getting reliable'},
    {date:now-D*11,score:6,skills:['Recall','Focus / attention'],focus:['Over-excited'],duration:10,note:'Recall in garden — 60% success'},
    {date:now-D*10,score:3,skills:['Loose lead'],focus:['Calm and engaged'],duration:8,note:'Better lead walking today'},
    {date:now-D*9,score:4,skills:['Sit / Down','Stay'],focus:['Super focused'],duration:10,note:'5-second stay achieved!'},
    {date:now-D*8,score:3,skills:['Recall','Polite greeting'],focus:['Calm and engaged'],duration:12,note:'Lovely calm greeting with visitor'},
    {date:now-D*7,score:5,skills:['Loose lead'],focus:['Easily distracted'],duration:8,note:'Tricky near other dogs'},
    {date:now-D*6,score:3,skills:['Recall','Sit / Down'],focus:['Super focused'],duration:10,note:'Best recall session yet!'},
    {date:now-D*5,score:2,skills:['Confidence games','Enrichment activity'],focus:['Calm and engaged'],duration:15,note:'Loved the muffin tin game'},
    {date:now-D*4,score:4,skills:['Stay','Polite greeting'],focus:['Super focused'],duration:10,note:'10-second stay! Massive win'},
    {date:now-D*3,score:2,skills:['Recall','Loose lead'],focus:['Calm and engaged'],duration:12,note:'Park walk — near-perfect recall'},
    {date:now-D*2,score:3,skills:['Socialisation'],focus:['Calm and engaged'],duration:15,note:'Met 3 new dogs calmly'},
    {date:now-D*1,score:2,skills:['Recall','Stay','Sit / Down'],focus:['Super focused'],duration:12,note:'All three skills solid today'},
    {date:now-D*0.3,score:2,skills:['Confidence games'],focus:['Calm and engaged'],duration:10,note:'New enrichment activity — loved it'},
  ];
  localStorage.setItem('fp_sessions', JSON.stringify(APP.sessions));
  APP.streak = 7;
  APP.xp = 680;
  localStorage.setItem('fp_streak', '7');
  localStorage.setItem('fp_xp', '680');
}

// ── Enrichment activities ─────────────────────────────
const ENRICHMENT = [
  {id:'sniff',    cat:'scent',      icon:'👃', name:'Sniff Walk Timer',      desc:'Let your dog lead and sniff freely on a long lead',    time:'10 min', level:'Beginner',    tip:'Sniffing is 40× more mentally tiring than walking. Let them stop and explore everything.'},
  {id:'scatter',  cat:'scent',      icon:'🌿', name:'Scatter Feeding',       desc:'Scatter kibble in grass — activates nose instinct',    time:'5 min',  level:'Beginner',    tip:'Use their daily kibble allowance. This slows eating, reduces stress and builds focus.'},
  {id:'muffin',   cat:'puzzle',     icon:'🧁', name:'Muffin Tin Game',       desc:'Hide treats under tennis balls for your dog to find',  time:'5 min',  level:'Beginner',    tip:'Start with all cups visible, then progress to hiding some empty. Builds problem-solving.'},
  {id:'lickmat',  cat:'calm',       icon:'😋', name:'Lick Mat Calm-Down',    desc:'Spread peanut butter or paste — promotes calm licking', time:'10 min', level:'Beginner',    tip:'Licking promotes serotonin. Use before training to lower arousal in excited dogs.'},
  {id:'kong',     cat:'calm',       icon:'❄️', name:'Frozen Kong',           desc:'Stuff and freeze for extended mental stimulation',      time:'2 min prep', level:'Beginner', tip:'Freeze for 2+ hours. Use during alone time, after walks, or to settle before rest.'},
  {id:'tug',      cat:'play',       icon:'🪢', name:'Structured Tug Play',   desc:'Controlled tug builds drive, focus and impulse control','time':'5 min',  level:'Intermediate', tip:'You control start and stop. Teach "drop it" first. Always end with you winning — briefly.'},
  {id:'boxes',    cat:'confidence', icon:'📦', name:'Confidence Boxes',      desc:'Novel objects on ground — explore and reward',          time:'8 min',  level:'Intermediate', tip:'Never force interaction. Let your dog choose to investigate. Reward all curiosity.'},
  {id:'flirt',    cat:'play',       icon:'🎣', name:'Flirt Pole Chase',      desc:'Physical exercise + impulse control training',          time:'5 min',  level:'Intermediate', tip:'Short bursts only — stop before your dog loses impulse control. Great pre-session warm-up.'},
  {id:'wobble',   cat:'confidence', icon:'🪨', name:'Wobble Board',          desc:'Build body awareness and confidence on unstable surfaces','time':'8 min', level:'Advanced',   tip:'Start with board on the floor, not wobbling. Reward all four paws on. Build slowly.'},
  {id:'snuffle',  cat:'scent',      icon:'🌀', name:'Snuffle Mat Feeding',   desc:'Feed entire meal through a snuffle mat',               time:'5 min',  level:'Beginner',    tip:'Wash weekly. Introduce slowly — some dogs find it frustrating at first. Jackpot when they succeed.'},
];

// ── Daily tips ────────────────────────────────────────
const TIPS = [
  'Short, frequent sessions (5 min × 3) beat one long 30-minute session every time.',
  'Always end on a success — even a simple sit. It leaves your dog feeling confident.',
  'Your dog reads your energy. Calm owner = calm dog. Take a breath before you start.',
  'Jackpot rewards (5–10 treats at once) on brilliant moments teach your dog they absolutely nailed it.',
  'Sniffing is 40× more mentally tiring than walking. A sniff walk is a workout for their brain.',
  'Luring is fine to start, but fade the food lure within 5 repetitions so the dog learns the cue.',
  'Never call your dog to something they find unpleasant — protect that recall cue at all costs.',
  'Enrichment before training = a calmer, more focused dog. Scatter feeding works brilliantly.',
  'The 3-second rule: if your dog doesn\'t respond within 3 seconds, reset and try again in an easier environment.',
  'Consistency beats intensity. 5 minutes every day beats 2 hours on a Sunday.',
];

// ── Milestones ─────────────────────────────────────────
const DEFAULT_MILESTONES = [
  {id:'m1', label:'First session logged! 🎉', xp:50, unlocked:true},
  {id:'m2', label:'5-day training streak 🔥', xp:100, unlocked:APP.streak>=5},
  {id:'m3', label:'10 sessions completed 📋', xp:150, unlocked:APP.sessions.length>=10},
  {id:'m4', label:'Recall in the garden ✓', xp:200, unlocked:APP.sessions.some(s=>s.skills&&s.skills.includes('Recall')&&s.score<=4)},
  {id:'m5', label:'5-second sit-stay achieved 🎯', xp:200, unlocked:APP.sessions.some(s=>s.skills&&s.skills.includes('Stay'))},
  {id:'m6', label:'Calm greeting with a visitor 🤝', xp:250, unlocked:APP.sessions.some(s=>s.skills&&s.skills.includes('Polite greeting'))},
  {id:'m7', label:'7-day training streak 🌟', xp:200, unlocked:APP.streak>=7},
  {id:'m8', label:'Module 1 complete 🏅', xp:500, unlocked:APP.currentModule>1},
];

// ── AI Coach responses ────────────────────────────────
const COACH_RESPONSES = {
  'ankle biting': 'Ankle biting is typically mouthing/play behaviour in puppies. Redirect immediately — yelp, freeze, then turn away. Offer a tug toy or chew instead. Consistency is key: every person in the household must respond the same way. It usually resolves by 4–5 months with consistent redirection.',
  'barking at visitors': 'Barking at visitors is usually frustration, fear, or rehearsed habit. The fix: manage the environment first (baby gate), teach a "go to mat" behaviour, then systematically desensitise using the doorbell at low volume from a distance. Never greet visitors until your dog is calm.',
  'recall': 'Build a "recall bank" — 20+ highly rewarded practice recalls daily in low-distraction environments before proofing outdoors. Use a unique recall cue (never overuse it), and jackpot every single successful return. Never call your dog to something unpleasant — protect that cue.',
  'enrichment': 'Today I\'d recommend: scatter feeding at breakfast, a lick mat before your training session (lowers arousal), and a 10-minute sniff walk on a long lead. These build focus, reduce frustration and improve recall motivation significantly.',
  'crate': 'Crate training fails when you go too fast. Start: door open, feed all meals inside, toss high-value treats in randomly throughout the day. Only close the door once your dog enters willingly. Build duration in 10-second increments — never let them cry it out.',
  'pulling': 'Loose-lead pulling fix: reward placement matters — reward at your hip, not out front. Use high-value treats (chicken/cheese). Reward every 3–5 steps without pulling. Stop immediately when tension appears. 5-minute focused street sessions beat long walks.',
  'confidence': 'Build confidence with "yes and explore" sessions — novel objects on the ground, your dog chooses whether to interact. Never force or push. Jackpot all brave investigative behaviour. Sniff walks, scatter feeding and lick mats all build calm confidence over time.',
  'socialisation': 'Quality over quantity: one calm, positive interaction is worth more than 20 chaotic ones. Observe your dog\'s body language — if they look away, yawn, or lick their lips they are stressed. Give them space and reward any calm looking.',
  'puppy biting': 'Puppy mouthing is normal but needs redirection. Yelp, freeze and turn away. Offer a chew or toy immediately. Reward all gentle mouth play. Never punish — it increases arousal. Ensure adequate sleep (16–18 hrs/day) as tiredness dramatically increases biting.',
};

const QUICK_TOPICS = [
  'How do I stop ankle biting?',
  'Why is my puppy barking at visitors?',
  'How do I build reliable recall?',
  'What enrichment should I do today?',
  'Why is crate training failing?',
  'How do I stop lead pulling?',
  'How do I build my dog\'s confidence?',
  'Tips for socialisation?',
];

// ── Dark mode ─────────────────────────────────────────
let isDark = localStorage.getItem('fp_theme') === 'dark';
function applyTheme() {
  document.body.className = isDark ? 'theme-dark' : 'theme-light';
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}
applyTheme();
document.getElementById('theme-toggle').addEventListener('click', () => {
  isDark = !isDark;
  localStorage.setItem('fp_theme', isDark ? 'dark' : '');
  applyTheme();
});

// ── Tab navigation ────────────────────────────────────
function switchTab(tabId) {
  document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  const page = document.getElementById('tab-' + tabId);
  if (page) page.classList.add('active');
  const btn = document.querySelector(`.nav-tab[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');
  if (tabId === 'home') renderHome();
  if (tabId === 'history') renderProgress();
  if (tabId === 'exercises') renderEnrichment('all');
  if (tabId === 'coach') initCoach();
  window.scrollTo(0, 0);
}

document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
});

// ── Streak banner ─────────────────────────────────────
function updateStreak() {
  const banner = document.getElementById('streak-banner');
  const text = document.getElementById('streak-text');
  if (APP.streak > 0) {
    banner.classList.remove('hidden');
    text.textContent = `${APP.streak}-day training streak — keep it up! 🐾`;
  }
}
updateStreak();

// ── HOME ──────────────────────────────────────────────
function renderHome() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('hero-greeting').textContent = greet + ' 👋';
  document.getElementById('hero-dog-name').textContent = APP.dogName + '\'s Training Companion';

  // Tip
  const tip = TIPS[new Date().getDate() % TIPS.length];
  document.getElementById('tip-text').textContent = tip;

  // Today's tasks
  const MODULE_TASKS = {
    1: ['🧠 Practice marker word (10 reps)', '👀 Focus & attention (5 min)', '😌 Calmness foundations — settle on mat'],
    2: ['📣 Recall in garden (10 calls)', '🦮 Loose lead — 5 min street walk', '🪑 Sit / Down reliability (20 reps)'],
    3: ['🌍 Environmental confidence walk', '🤝 Calm social greeting practice', '🌟 Confidence building game (10 min)'],
    4: ['🏠 Alone time practice (10 min)', '🧸 Crate confidence session', '😌 Calm household behaviour'],
    5: ['🐽 Scent work foundations (10 min)', '🧩 Advanced enrichment activity', '🎯 Long-term habit reinforcement'],
  };
  const tasks = MODULE_TASKS[APP.currentModule] || MODULE_TASKS[1];
  document.getElementById('today-tasks-list').innerHTML = tasks.map((t, i) => `
    <div class="task-item" id="task-${i}">
      <button class="task-check" onclick="toggleTask(${i})">○</button>
      <span class="task-label">${t}</span>
    </div>`).join('');

  // Milestones
  const unlocked = DEFAULT_MILESTONES.filter(m => m.unlocked);
  document.getElementById('milestone-strip').innerHTML = unlocked.slice(-3).map(m =>
    `<div class="milestone-chip">🏅 ${m.label}</div>`).join('');

  // Mini chart
  setTimeout(() => renderWeekChart(), 80);
}

function toggleTask(i) {
  const item = document.getElementById('task-' + i);
  const btn = item.querySelector('.task-check');
  const label = item.querySelector('.task-label');
  const done = btn.textContent === '✓';
  btn.textContent = done ? '○' : '✓';
  btn.style.background = done ? '' : 'var(--primary)';
  btn.style.color = done ? '' : '#fff';
  label.style.textDecoration = done ? '' : 'line-through';
  label.style.opacity = done ? '' : '0.5';
  if (!done) showToast('✅ Task complete! +10 XP');
}

function renderWeekChart() {
  const canvas = document.getElementById('week-chart');
  if (!canvas) return;
  const recent = APP.sessions.slice(-7);
  const labels = recent.map(s => {
    const d = new Date(s.date);
    return ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()];
  });
  const data = recent.map(s => 10 - (s.score || 5)); // invert: higher score = better session
  drawMiniChart(canvas, labels, data, '#3a7d44', 'rgba(58,125,68,.15)');
}

// ── SCORE SCALE ───────────────────────────────────────
function buildScoreScale() {
  const container = document.getElementById('score-scale');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'scale-btn';
    btn.textContent = i;
    btn.setAttribute('data-v', i);
    btn.addEventListener('click', () => {
      container.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      APP.selectedScore = i;
      const disp = document.getElementById('score-display');
      const ctx = document.getElementById('score-context');
      if (disp) disp.textContent = i;
      const contexts = {
        0:'🌟 Perfect session!', 1:'🌟 Outstanding!', 2:'✅ Brilliant session',
        3:'✅ Good session', 4:'🟡 Decent session', 5:'🟡 Moderate difficulty',
        6:'🟠 Challenging session', 7:'🟠 Tough day', 8:'🔴 Very hard session',
        9:'🔴 Really tough', 10:'🔴 Extremely difficult'
      };
      if (ctx) ctx.textContent = contexts[i] || '';
    });
    container.appendChild(btn);
  }
}

// ── Tag selection ─────────────────────────────────────
function initTagGroups() {
  document.querySelectorAll('#skills-tags .tag, #focus-tags .tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      const group = tag.closest('#skills-tags') ? 'selectedSkills' : 'selectedFocus';
      const val = tag.getAttribute('data-tag');
      const idx = APP[group].indexOf(val);
      if (idx === -1) APP[group].push(val);
      else APP[group].splice(idx, 1);
    });
  });
}

// ── Submit session ────────────────────────────────────
document.getElementById('submit-session').addEventListener('click', () => {
  if (APP.selectedScore === null) { showToast('⚠️ Please rate your session first'); return; }

  const session = {
    date: Date.now(),
    score: APP.selectedScore,
    skills: [...APP.selectedSkills],
    focus: [...APP.selectedFocus],
    duration: parseInt(document.getElementById('duration-input').value) || 10,
    note: document.getElementById('session-note').value.trim(),
  };

  APP.sessions.unshift(session);
  localStorage.setItem('fp_sessions', JSON.stringify(APP.sessions));

  APP.xp += 50;
  APP.streak = Math.min(APP.streak + 1, 365);
  localStorage.setItem('fp_xp', APP.xp);
  localStorage.setItem('fp_streak', APP.streak);
  updateStreak();

  // Feedback
  const score = APP.selectedScore;
  const msgs = {
    low:  'Brilliant session! 🌟 Your dog performed superbly. Short, consistent sessions like this build the best foundation.',
    mid:  'Good effort! Some challenges but great persistence. Follow up with an enrichment activity to wind down.',
    high: 'Tough session — completely normal. Every dog has off days. Keep it short and always end on a win.',
  };
  const tips = {
    low:  '💡 Jackpot rewards (5–10 treats) on brilliant sessions signal to your dog they absolutely nailed it!',
    mid:  '💡 Always end on something your dog can succeed at — even a simple sit restores confidence.',
    high: '💡 A 5-minute sniff walk on a long lead resets arousal far better than drilling exercises again.',
  };
  const level = score <= 3 ? 'low' : score <= 6 ? 'mid' : 'high';
  const badgeColors = {low:'#d1fae5',mid:'#fef3c7',high:'#fee2e2'};
  const badgeText = {low:'🌟 Excellent',mid:'✅ Good effort',high:'💪 Tough one'};

  const fb = document.getElementById('feedback-card');
  const badge = document.getElementById('feedback-score-badge');
  const msg = document.getElementById('feedback-message');
  const tip = document.getElementById('feedback-tip');
  badge.textContent = badgeText[level];
  badge.style.background = badgeColors[level];
  msg.textContent = msgs[level];
  tip.textContent = tips[level];
  fb.classList.remove('hidden');

  // Reset form
  APP.selectedScore = null;
  APP.selectedSkills = [];
  APP.selectedFocus = [];
  buildScoreScale();
  document.querySelectorAll('#skills-tags .tag, #focus-tags .tag').forEach(t => t.classList.remove('active'));
  document.getElementById('duration-input').value = '';
  document.getElementById('session-note').value = '';

  showToast('✅ Session saved! +50 XP 🔥');
  setTimeout(() => fb.classList.add('hidden'), 6000);
});

// ── PROGRESS ──────────────────────────────────────────
function renderProgress() {
  const sessions = APP.sessions;
  const total = sessions.length;
  const avg = total ? (sessions.reduce((s, ci) => s + (10 - ci.score), 0) / total).toFixed(1) : '–';
  const recent7 = sessions.slice(0, 7).reduce((s, ci) => s + (10 - ci.score), 0) / Math.min(7, total || 1);
  const prev7 = sessions.slice(7, 14);
  const prevAvg = prev7.length ? prev7.reduce((s, ci) => s + (10 - ci.score), 0) / prev7.length : recent7;
  const trend = Math.round((recent7 - prevAvg) / (prevAvg || 1) * 100);

  document.getElementById('progress-stats').innerHTML = `
    <div class="pstat"><div class="pstat-val">${avg}</div><div class="pstat-lbl">Avg Score</div></div>
    <div class="pstat"><div class="pstat-val">${total}</div><div class="pstat-lbl">Sessions</div></div>
    <div class="pstat"><div class="pstat-val">🔥 ${APP.streak}</div><div class="pstat-lbl">Streak</div></div>
    <div class="pstat"><div class="pstat-val" style="color:${trend>=0?'var(--low)':'var(--high)'}">${trend>=0?'↑':'↓'}${Math.abs(trend)}%</div><div class="pstat-lbl">This Week</div></div>`;

  setTimeout(() => renderProgressChart('score'), 80);
  renderMilestonesList();
  renderHistoryList();
}

let progressChartType = 'score';
function switchProgressChart(type, btn) {
  progressChartType = type;
  document.querySelectorAll('.chart-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProgressChart(type);
}

function renderProgressChart(type) {
  const canvas = document.getElementById('progress-chart');
  if (!canvas) return;
  const slice = APP.sessions.slice(0, 14).reverse();
  let data, labels, color, fill;
  labels = slice.map(s => { const d = new Date(s.date); return `${d.getDate()}/${d.getMonth()+1}`; });

  if (type === 'score') {
    data = slice.map(s => 10 - (s.score || 5));
    color = '#3a7d44'; fill = 'rgba(58,125,68,.15)';
  } else if (type === 'recall') {
    data = slice.map(s => (s.skills && s.skills.includes('Recall')) ? Math.max(0, 10 - s.score) * 10 : null).filter(v => v !== null);
    labels = slice.filter(s => s.skills && s.skills.includes('Recall')).map(s => { const d = new Date(s.date); return `${d.getDate()}/${d.getMonth()+1}`; });
    color = '#f4a435'; fill = 'rgba(244,164,53,.15)';
  } else {
    data = slice.map(s => Math.round((10 - s.score) * 9));
    color = '#7c3aed'; fill = 'rgba(124,58,237,.15)';
  }
  if (!data.length) data = [0];
  drawMiniChart(canvas, labels, data, color, fill, 160);
}

function renderMilestonesList() {
  const el = document.getElementById('milestones-list');
  if (!el) return;
  const milestones = DEFAULT_MILESTONES;
  el.innerHTML = milestones.map(m => `
    <div class="milestone-item ${m.unlocked ? 'unlocked' : 'locked'}">
      <span class="ms-icon">${m.unlocked ? '🏅' : '🔒'}</span>
      <span class="ms-label">${m.label}</span>
      <span class="ms-xp">+${m.xp} XP</span>
    </div>`).join('');
}

function renderHistoryList() {
  const el = document.getElementById('history-list');
  if (!el) return;
  if (!APP.sessions.length) {
    el.innerHTML = '<p class="empty-state">No sessions logged yet. Start your first training session!</p>';
    return;
  }
  el.innerHTML = APP.sessions.slice(0, 10).map(s => {
    const d = new Date(s.date);
    const inv = 10 - s.score;
    const bg = inv >= 8 ? '#d1fae5' : inv >= 5 ? '#fef3c7' : '#fee2e2';
    const col = inv >= 8 ? '#065f46' : inv >= 5 ? '#92400e' : '#991b1b';
    return `<div class="history-item">
      <div class="h-score" style="background:${bg};color:${col}">${inv}/10</div>
      <div class="h-meta">
        <div class="h-date">${d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})} · ${s.duration}min</div>
        <div class="h-tags">${(s.skills||[]).map(sk=>`<span class="h-tag">${sk}</span>`).join('')}</div>
        ${s.note ? `<div class="h-note">${s.note}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ── ENRICHMENT ────────────────────────────────────────
let currentFilter = 'all';

function filterEnrichment(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.ex-filter').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEnrichment(cat);
}

function renderEnrichment(cat) {
  const list = cat === 'all' ? ENRICHMENT : ENRICHMENT.filter(e => e.cat === cat);
  document.getElementById('exercise-cards').innerHTML = list.map(e => {
    const done = APP.completedActivities.includes(e.id);
    return `<div class="exercise-card ${done ? 'done' : ''}">
      <div class="exercise-icon">${e.icon}</div>
      <div class="exercise-info">
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <div class="ex-meta">
          <span class="ex-pill">⏱ ${e.time}</span>
          <span class="ex-pill">${e.level}</span>
        </div>
        <div class="ex-tip">${e.tip}</div>
      </div>
      ${done
        ? '<div class="ex-done-badge">✅ Done today</div>'
        : `<button class="btn-start-ex" onclick="startActivity('${e.id}')">Start</button>`}
    </div>`;
  }).join('');
}

function startActivity(id) {
  const act = ENRICHMENT.find(e => e.id === id);
  if (!act) return;

  // Simple instant-complete activities
  const instant = {
    'kong': '❄️ Stuff your Kong and pop it in the freezer for 2+ hours. Ready for the next session!',
    'snuffle': '🌀 Pour their meal portion into the snuffle mat and let them get to work!',
  };
  if (instant[id]) {
    showToast(instant[id]);
    completeActivity(id);
    return;
  }

  // Timer-based runner
  const phases = {
    'sniff':   [{l:'Walk & sniff freely',d:120,c:'inhale'},{l:'Pause & jackpot reward',d:5,c:'exhale'}],
    'scatter': [{l:'Scatter kibble in grass',d:5,c:'hold'},{l:'Release — let them search!',d:90,c:'inhale'},{l:'Find last pieces — reward!',d:15,c:'exhale'}],
    'muffin':  [{l:'Place treats under balls',d:10,c:'hold'},{l:'Let your dog search',d:30,c:'inhale'},{l:'Jackpot the find!',d:5,c:'exhale'}],
    'lickmat': [{l:'Spread food paste on mat',d:10,c:'hold'},{l:'Dog licking calmly',d:120,c:'inhale'},{l:'Finished — nice calm dog!',d:5,c:'exhale'}],
    'tug':     [{l:'Offer tug toy',d:5,c:'inhale'},{l:'Active tug play!',d:10,c:'inhale'},{l:'Drop cue',d:3,c:'hold'},{l:'Reward & reset',d:5,c:'exhale'}],
    'boxes':   [{l:'Place object on ground',d:5,c:'hold'},{l:'Dog investigates freely',d:15,c:'inhale'},{l:'Jackpot any curiosity!',d:5,c:'exhale'}],
    'flirt':   [{l:'Move flirt pole',d:8,c:'inhale'},{l:'Pause — reward calm',d:5,c:'hold'},{l:'Go again!',d:8,c:'inhale'}],
    'wobble':  [{l:'4 paws on board',d:5,c:'hold'},{l:'Slight wobble — reward!',d:10,c:'inhale'},{l:'Rest & reward',d:5,c:'exhale'}],
  };

  const p = phases[id] || phases['sniff'];
  runActivityTimer(act.name, p, id);
}

let actTimerInterval = null;
let actPhaseIdx = 0;
let actCycleCount = 0;
let actMaxCycles = 3;
let actPhases = [];
let actCurrentId = null;

function runActivityTimer(name, phases, actId) {
  actPhases = phases;
  actPhaseIdx = 0;
  actCycleCount = 0;
  actMaxCycles = actId === 'sniff' || actId === 'lickmat' ? 2 : 3;
  actCurrentId = actId;

  document.getElementById('runner-title').textContent = name;
  document.getElementById('exercise-runner').classList.remove('hidden');
  runPhase(0);
}

function runPhase(idx) {
  if (actCycleCount >= actMaxCycles) { finishActivity(); return; }
  const phase = actPhases[idx % actPhases.length];
  const circle = document.getElementById('breath-circle');
  circle.className = 'breath-circle ' + phase.c;
  document.getElementById('runner-instruction').textContent = phase.l;
  document.getElementById('runner-step').textContent = `Round ${actCycleCount + 1} of ${actMaxCycles}`;

  let t = phase.d;
  clearInterval(actTimerInterval);
  actTimerInterval = setInterval(() => {
    t--;
    if (t <= 0) {
      clearInterval(actTimerInterval);
      const nextIdx = idx + 1;
      if (nextIdx % actPhases.length === 0) actCycleCount++;
      runPhase(nextIdx);
    }
  }, 1000);
}

function finishActivity() {
  clearInterval(actTimerInterval);
  document.getElementById('exercise-runner').classList.add('hidden');
  completeActivity(actCurrentId);
  showToast('🎉 Activity complete! +30 XP 🧩');
  APP.xp += 30;
  localStorage.setItem('fp_xp', APP.xp);
  renderEnrichment(currentFilter);
}

function completeActivity(id) {
  if (!APP.completedActivities.includes(id)) {
    APP.completedActivities.push(id);
    localStorage.setItem('fp_completed_acts', JSON.stringify(APP.completedActivities));
  }
}

document.getElementById('runner-stop').addEventListener('click', () => {
  clearInterval(actTimerInterval);
  document.getElementById('exercise-runner').classList.add('hidden');
  if (actCurrentId) completeActivity(actCurrentId);
  showToast('Activity ended — great work!');
  renderEnrichment(currentFilter);
});

// ── AI COACH ─────────────────────────────────────────
let coachInitialised = false;

function initCoach() {
  if (coachInitialised) return;
  coachInitialised = true;
  addCoachMessage('assistant', `Hi there! 👋 I'm your Four Paws AI Training Coach. I can give you personalised guidance on training challenges, enrichment ideas, and behaviour questions for ${APP.dogName}. What would you like help with today?`);

  // Quick topics
  document.getElementById('quick-topics').innerHTML = QUICK_TOPICS.map(q =>
    `<button class="quick-topic-btn" onclick="askCoach('${q.replace(/'/g,"\\'")}')">💬 ${q}</button>`
  ).join('');

  // Quick btns in panel
  document.getElementById('coach-quick-btns').innerHTML = QUICK_TOPICS.slice(0, 4).map(q =>
    `<button class="coach-quick-btn" onclick="askCoach('${q.replace(/'/g,"\\'")}')">⚡ ${q}</button>`
  ).join('');

  document.getElementById('coach-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendCoachMessage();
  });
}

function addCoachMessage(role, text) {
  const chat = document.getElementById('coach-chat');
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg-${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendCoachMessage() {
  const input = document.getElementById('coach-input');
  const q = input.value.trim();
  if (!q) return;
  addCoachMessage('user', q);
  input.value = '';
  setTimeout(() => {
    const lq = q.toLowerCase();
    let resp = `Great question about "${q.substring(0,40)}". My key advice: focus on one behaviour at a time, keep sessions under 5 minutes, and always end on something your dog can succeed at. Reach out to your trainer if you need personalised 1:1 support for this specific challenge.`;
    Object.entries(COACH_RESPONSES).forEach(([k, v]) => {
      if (lq.includes(k)) resp = v;
    });
    addCoachMessage('assistant', resp);
  }, 700);
}

function askCoach(q) {
  document.getElementById('coach-input').value = q;
  sendCoachMessage();
}

// ── CHART HELPER ──────────────────────────────────────
function drawMiniChart(canvas, labels, data, color, fill, height) {
  if (!canvas || !data.length) return;
  const W = canvas.offsetWidth || 340;
  const H = height || parseInt(canvas.getAttribute('height')) || 90;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const pad = 14, max = Math.max(...data, 1), min = 0;
  const xStep = (W - pad * 2) / (data.length - 1 || 1);
  const yScale = (H - pad * 2) / (max - min || 1);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 2; g++) {
    const gy = pad + g * (H - pad * 2) / 2;
    ctx.beginPath(); ctx.moveTo(pad, gy); ctx.lineTo(W - pad, gy); ctx.stroke();
  }
  // Fill
  ctx.beginPath();
  data.forEach((v, i) => { const x = pad + i * xStep, y = H - pad - (v - min) * yScale; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.lineTo(pad + (data.length - 1) * xStep, H - pad);
  ctx.lineTo(pad, H - pad);
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  data.forEach((v, i) => { const x = pad + i * xStep, y = H - pad - (v - min) * yScale; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
  ctx.stroke();
  // Dots
  data.forEach((v, i) => {
    const x = pad + i * xStep, y = H - pad - (v - min) * yScale;
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  });
  // Labels
  ctx.fillStyle = isDark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)';
  ctx.font = '10px system-ui'; ctx.textAlign = 'center';
  labels.forEach((l, i) => ctx.fillText(l, pad + i * xStep, H - 1));
}

// ── TOAST ─────────────────────────────────────────────
function showToast(msg) {
  let t = document.getElementById('fp-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'fp-toast';
    t.style.cssText = 'position:fixed;bottom:96px;left:50%;transform:translateX(-50%) translateY(40px);background:#1e2d12;color:#fff;padding:10px 20px;border-radius:99px;font-size:13px;font-weight:600;z-index:9999;opacity:0;transition:all .3s ease;white-space:nowrap;pointer-events:none';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateX(-50%) translateY(40px)';
  }, 2800);
}

// ── SERVICE WORKER ────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./ap3x-sw.js').catch(() => {});
}

// ── INIT ──────────────────────────────────────────────
buildScoreScale();
initTagGroups();
renderHome();
