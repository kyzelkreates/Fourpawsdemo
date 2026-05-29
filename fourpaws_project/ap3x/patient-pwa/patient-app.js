/* ═══════════════════════════════════════════════════════
   FOUR PAWS ACADEMY — TRAINING COMPANION PWA
   Full application logic: sessions, courses, progress, enrichment, AI coach
════════════════════════════════════════════════════════ */
'use strict';

// ── Helpers ───────────────────────────────────────────
function $  (id) { return document.getElementById(id); }
function qs (sel) { return document.querySelector(sel); }
function qsa (sel) { return document.querySelectorAll(sel); }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function load(key, def) { try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : def; } catch(e) { return def; } }

// ── Puppy Masterclass curriculum ──────────────────────
const CURRICULUM = [
  {
    id: 1, name: 'Module 1 — Foundations',
    emoji: '🌱', xp: 500,
    lessons: [
      { id: 'l1_1', name: 'Understanding Puppy Psychology',     desc: 'How dogs learn, critical periods and building trust',           tip: 'Puppies learn through association — make every interaction positive.',                          xp: 50 },
      { id: 'l1_2', name: 'Marker Word Training',               desc: 'Introducing the clicker or verbal marker cue',                  tip: 'Your marker word (e.g. "yes!") must always be followed by a reward — no exceptions.',          xp: 50 },
      { id: 'l1_3', name: 'Focus & Attention Building',         desc: 'Teaching your dog to check in with you voluntarily',            tip: 'Reward every eye contact that your dog offers. Capture it, don\'t prompt it.',                  xp: 60 },
      { id: 'l1_4', name: 'Reward Timing Fundamentals',         desc: 'Mark the exact moment of the behaviour you want',               tip: 'The reward must land within 1.5 seconds of the behaviour. Film yourself to check timing.',      xp: 60 },
      { id: 'l1_5', name: 'Calmness Foundations',               desc: 'Building a settle cue and reducing arousal at home',            tip: 'Calm dogs are trained dogs. Reward any moment of stillness — even accidental.',                 xp: 80 },
    ]
  },
  {
    id: 2, name: 'Module 2 — Core Obedience',
    emoji: '🎯', xp: 600,
    lessons: [
      { id: 'l2_1', name: 'Sit & Down Reliability',             desc: 'Building 20+ successful reps in multiple environments',         tip: 'A reliable sit means 9/10 responses anywhere. If below that, stay in this lesson.',            xp: 60 },
      { id: 'l2_2', name: 'Recall Foundations',                 desc: 'Building the "come" cue as the most rewarding thing in the world', tip: 'Never call your dog to something unpleasant. Protect that recall cue at all costs.',          xp: 80 },
      { id: 'l2_3', name: 'Loose Lead Walking',                 desc: 'Teaching your dog that a loose lead keeps the walk going',      tip: 'Reward placement matters — treat at your hip, not out front. Stop the instant tension appears.', xp: 80 },
      { id: 'l2_4', name: 'Calm Door Behaviour',                desc: 'No rushing, no jumping — a controlled exit routine',            tip: 'Your dog only gets what they want (going out) when all four paws are on the floor.',            xp: 60 },
      { id: 'l2_5', name: 'Polite Greeting Skills',             desc: 'Four paws on the floor when meeting people and dogs',           tip: 'Set up greetings you can control. End the greeting the moment jumping begins.',                 xp: 70 },
    ]
  },
  {
    id: 3, name: 'Module 3 — Socialisation & Confidence',
    emoji: '🌍', xp: 700,
    lessons: [
      { id: 'l3_1', name: 'Environmental Confidence',           desc: 'Exposing your dog to novel sounds, surfaces and environments',  tip: 'Never force interaction. Let your dog choose to approach — reward all brave investigative behaviour.', xp: 70 },
      { id: 'l3_2', name: 'Positive Social Exposure',           desc: 'Structured introductions to other dogs and people',            tip: 'Quality beats quantity — one calm, positive interaction is worth more than ten chaotic ones.', xp: 80 },
      { id: 'l3_3', name: 'Reducing Overstimulation',           desc: 'Managing and lowering arousal in high-distraction environments', tip: 'Enrichment before training lowers arousal. A sniff walk is the best pre-session warm-up.',    xp: 80 },
      { id: 'l3_4', name: 'New Experience Handling',            desc: 'Vets, groomers, car travel — positive conditioning',           tip: 'Work at the lowest intensity your dog is comfortable with. Build in tiny steps.',               xp: 70 },
      { id: 'l3_5', name: 'Confidence Building Games',          desc: 'Wobble boards, novel objects and exploration games',            tip: 'Confident dogs are curious. Reward every moment of brave investigation, no matter how small.', xp: 80 },
    ]
  },
  {
    id: 4, name: 'Module 4 — Home Life Success',
    emoji: '🏠', xp: 650,
    lessons: [
      { id: 'l4_1', name: 'Toilet Training System',             desc: 'A consistent routine that ends accidents fast',                 tip: 'Take outside every 45 mins, after every meal, sleep and play. No exceptions for 2 weeks.',    xp: 60 },
      { id: 'l4_2', name: 'Crate Confidence',                   desc: 'Building a safe, voluntary retreat your dog loves',            tip: 'Never lock the crate until your dog enters willingly. Build duration in 10-second increments.', xp: 70 },
      { id: 'l4_3', name: 'Alone Time Training',                desc: 'Preventing separation distress through gradual independence',  tip: 'Start with 10 seconds, literally. Build to 5 minutes before increasing to 15, then 30.',       xp: 80 },
      { id: 'l4_4', name: 'Reducing Destructive Behaviour',     desc: 'Management, enrichment and appropriate outlets',               tip: 'Management first — remove the opportunity. Then provide a better alternative (frozen Kong, scatter feeding).', xp: 70 },
      { id: 'l4_5', name: 'Calm Household Behaviour',           desc: 'Settle on mat, calm greetings and relaxed mealtimes',         tip: 'A dog that can settle in a busy household has mastered impulse control. Reward all calm moments.', xp: 70 },
    ]
  },
  {
    id: 5, name: 'Module 5 — Enrichment & Long-Term Development',
    emoji: '🧩', xp: 800,
    lessons: [
      { id: 'l5_1', name: 'Mental Stimulation Games',           desc: 'Puzzle feeders, snuffle mats and problem-solving',             tip: 'A mentally tired dog is a well-behaved dog. 10 mins of mental work beats 30 mins of walking.', xp: 80 },
      { id: 'l5_2', name: 'Structured Play Systems',            desc: 'Using play as reinforcement — tug, chase and retrieve',        tip: 'Play is the best reward for high-drive dogs. Make yourself more fun than the environment.',    xp: 80 },
      { id: 'l5_3', name: 'Scent Work Foundations',             desc: 'Introducing nose work games and hide-and-seek',                tip: 'Sniffing releases dopamine and serotonin. A dog who sniffs is a calm and happy dog.',         xp: 90 },
      { id: 'l5_4', name: 'Long-Term Habit Reinforcement',      desc: 'Maintaining skills under distraction, distance and duration',  tip: 'The 3 Ds: duration, distance, distraction. Only work on one at a time.',                      xp: 80 },
      { id: 'l5_5', name: 'Advanced Enrichment Planning',       desc: 'Designing a weekly enrichment schedule for your dog',          tip: 'Aim for: 1 scent activity, 1 puzzle, 1 confidence game, and 1 play session every 48 hours.',   xp: 90 },
    ]
  },
];

// ── Enrichment activities ─────────────────────────────
const ENRICHMENT = [
  { id:'sniff',    cat:'scent',      icon:'👃', name:'Sniff Walk Timer',        desc:'Let your dog lead and sniff freely on a long lead', time:'10 min', level:'Beginner',    tip:'Sniffing is 40× more tiring than walking. Let them stop and explore everything.', phases:[{l:'Walk & sniff freely',d:60,c:'inhale'},{l:'Pause & jackpot!',d:5,c:'exhale'}], cycles:4 },
  { id:'scatter',  cat:'scent',      icon:'🌿', name:'Scatter Feeding',          desc:'Scatter kibble in grass — activates nose instinct', time:'5 min',  level:'Beginner',    tip:'Use their meal kibble. Slows eating, reduces stress, builds focus.', phases:[{l:'Scatter kibble in grass',d:10,c:'hold'},{l:'Let them search!',d:60,c:'inhale'},{l:'Jackpot on last piece',d:5,c:'exhale'}], cycles:2 },
  { id:'muffin',   cat:'puzzle',     icon:'🧁', name:'Muffin Tin Game',          desc:'Hide treats under tennis balls in a tin',           time:'5 min',  level:'Beginner',    tip:'Start with all cups visible, then hide some empty. Builds problem-solving.', phases:[{l:'Hide treats under balls',d:10,c:'hold'},{l:'Release — let them find!',d:30,c:'inhale'},{l:'Jackpot the find!',d:5,c:'exhale'}], cycles:3 },
  { id:'lickmat',  cat:'calm',       icon:'😋', name:'Lick Mat Calm-Down',       desc:'Spread food paste — promotes calm licking',         time:'10 min', level:'Beginner',    tip:'Licking releases serotonin. Use before training to lower arousal.', phases:[{l:'Dog licking calmly',d:120,c:'inhale'},{l:'Refill if needed',d:10,c:'hold'}], cycles:2 },
  { id:'kong',     cat:'calm',       icon:'❄️', name:'Frozen Kong',              desc:'Stuff and freeze for extended mental stimulation',   time:'2 min', level:'Beginner',    tip:'Freeze for 2+ hours. Perfect for alone time, settling after walks.', instant:'❄️ Stuff your Kong now and pop it in the freezer for 2+ hours. It\'ll be ready for the next session!' },
  { id:'tug',      cat:'play',       icon:'🪢', name:'Structured Tug Play',      desc:'Controlled tug builds drive and impulse control',    time:'5 min',  level:'Intermediate', tip:'You control start and stop. Teach "drop it" first. Always end with you holding the toy.', phases:[{l:'Offer the tug toy',d:5,c:'inhale'},{l:'Active tug!',d:8,c:'inhale'},{l:'"Drop it" cue',d:3,c:'hold'},{l:'Reward & reset',d:5,c:'exhale'}], cycles:4 },
  { id:'boxes',    cat:'confidence', icon:'📦', name:'Confidence Box Game',       desc:'Novel objects on ground — explore and reward',      time:'8 min',  level:'Intermediate', tip:'Never force interaction. Let your dog choose to approach. Jackpot all brave moments.', phases:[{l:'Place object on floor',d:5,c:'hold'},{l:'Let dog investigate freely',d:15,c:'inhale'},{l:'Jackpot any contact!',d:5,c:'exhale'}], cycles:3 },
  { id:'wobble',   cat:'confidence', icon:'🪨', name:'Wobble Board',              desc:'Build body awareness on unstable surfaces',         time:'8 min',  level:'Advanced',    tip:'Start flat, not wobbling. Reward 4 paws on. Build confidence before movement.', phases:[{l:'Lure all 4 paws on board',d:10,c:'hold'},{l:'Jackpot stillness',d:5,c:'exhale'},{l:'Gentle wobble',d:8,c:'inhale'},{l:'Reward calm!',d:5,c:'exhale'}], cycles:3 },
  { id:'snuffle',  cat:'scent',      icon:'🌀', name:'Snuffle Mat Feeding',       desc:'Feed entire meal through a snuffle mat',             time:'5 min',  level:'Beginner',    tip:'Wash weekly. Introduce slowly — jackpot when they persist past frustration.', phases:[{l:'Spread food in mat',d:10,c:'hold'},{l:'Let them snuffle!',d:60,c:'inhale'},{l:'Reward persistence',d:5,c:'exhale'}], cycles:2 },
  { id:'flirt',    cat:'play',       icon:'🎣', name:'Flirt Pole Chase',          desc:'Physical exercise + impulse control',               time:'5 min',  level:'Intermediate', tip:'Short bursts only. Stop before they lose impulse control. Great pre-session warm-up.', instant:'🎣 Move the flirt pole in short bursts (5–8 secs). Stop before your dog loses impulse control. Reward calm stops with a treat!' },
];

// ── Daily tips ────────────────────────────────────────
const TIPS = [
  'Short, frequent sessions (5 min × 3) beat one long 30-minute session every time.',
  'Always end on a success — even a simple sit. It leaves your dog feeling confident.',
  'Your dog reads your energy. Calm owner = calm dog. Take a breath before you start.',
  'Jackpot rewards (5–10 treats at once) on brilliant moments teach your dog they absolutely nailed it.',
  'Sniffing is 40× more mentally tiring than walking. A sniff walk is a full brain workout.',
  'Luring is fine to start, but fade the food lure within 5 repetitions so the dog learns the cue.',
  'Never call your dog to something unpleasant — protect that recall cue with your life.',
  'Enrichment before training = a calmer, more focused dog. Scatter feeding works brilliantly.',
  'The 3-second rule: if your dog doesn\'t respond within 3 seconds, reset and try in an easier environment.',
  'Consistency beats intensity. 5 minutes every day beats 2 hours on a Sunday.',
  'Confidence is built one tiny brave step at a time. Never rush socialisation.',
  'A tired dog is not a trained dog — mental exercise creates the calmest, most biddable dog.',
];

// ── AI responses ──────────────────────────────────────
const AI_RESP = {
  'ankle biting':    'Ankle biting is play/mouthing behaviour in puppies. Yelp, freeze and turn away immediately. Offer a tug toy or chew as a redirect. Every person in the household must respond the same way. It resolves by 4–5 months with consistent redirection and adequate sleep.',
  'barking':         'Barking at visitors: manage first (baby gate), teach a "go to mat" behaviour, then desensitise the doorbell from a distance. Never greet visitors until your dog is calm on the mat.',
  'recall':          'Build a "recall bank" — 20+ highly rewarded recalls daily in low-distraction environments before proofing outside. Use a unique recall cue, never overuse it, and jackpot every single return. Never call your dog to anything unpleasant.',
  'enrichment':      'Today I\'d recommend: scatter feeding at breakfast, a lick mat before your training session, and a 10-minute sniff walk on a long lead. These build focus, lower arousal and improve recall motivation significantly.',
  'crate':           'Crate training fails when you go too fast. Start with the door open and feed all meals inside. Only close the door once your dog enters willingly. Build duration in 10-second increments — never let them cry it out.',
  'pulling':         'Loose lead fix: reward at your hip, not out front. Use high-value treats (chicken/cheese). Reward every 3–5 steps without tension. Stop the instant the lead tightens. 5-minute focused sessions beat long walks.',
  'confidence':      'Confidence builds one tiny brave step at a time. Novel objects on the ground, your dog chooses to approach. Never force interaction. Jackpot all brave investigative behaviour. Enrichment and sniff walks build calm confidence over time.',
  'biting':          'Puppy biting: yelp, freeze, turn away. Redirect to a chew or tug immediately. Reward all gentle mouth play. Never punish — it increases arousal. Ensure 16–18 hours of sleep daily; tiredness dramatically increases biting.',
  'socialisation':   'Quality over quantity: one calm positive interaction beats 20 chaotic ones. Watch your dog\'s body language — lip licking, yawning, looking away all mean stress. Give space and reward all calm behaviour.',
  'focus':           'Build focus by rewarding check-ins — every time your dog glances at you voluntarily, mark and reward. Work in boring environments first. A dog that chooses to focus on you is more valuable than one forced to by a lure.',
  'sit':             'For a reliable sit: 20+ rewarded reps per session in different locations. Fade the lure by rep 5. Proof in garden, then street, then park. A reliable sit should get a 9/10 response rate anywhere before moving on.',
  'stay':            'Build stay using 3 Ds: duration first (build to 30s), then distance (one step back), then distraction. Only work on ONE D at a time. Never leave on a failed stay — make it easier and succeed before ending.',
};

const QUICK_TOPICS = [
  'How do I stop ankle biting?',
  'Why is recall breaking down outside?',
  'What enrichment should I do today?',
  'How do I build crate confidence?',
  'How do I stop lead pulling?',
  'How do I build my dog\'s confidence?',
  'Tips for puppy socialisation?',
  'How do I teach a reliable stay?',
];

// ══════════════════════════════════════════════════════
//  APP STATE
// ══════════════════════════════════════════════════════
const APP = {
  sessions:           load('fp_sessions', []),
  completedLessons:   load('fp_lessons', []),
  completedActivities:load('fp_acts', []),
  tasks:              load('fp_tasks_' + new Date().toDateString(), [false,false,false]),
  streak:             load('fp_streak', 0),
  xp:                 load('fp_xp', 0),
  dogName:            load('fp_dog', 'Your Dog'),
  selectedScore:      null,
  selectedSkills:     [],
  selectedFocus:      [],
  currentEnrichCat:   'all',
  coachReady:         false,
  runnerInterval:     null,
};

// Seed demo sessions if empty
if (!APP.sessions.length) {
  const now = Date.now(), D = 86400000;
  APP.sessions = [
    {date:now-D*13,score:5,skills:['Recall','Sit / Down'],focus:['Easily distracted'],duration:8,note:'First session — very excited!'},
    {date:now-D*12,score:4,skills:['Sit / Down'],focus:['Easily distracted'],duration:6,note:'Sit getting more reliable'},
    {date:now-D*11,score:6,skills:['Recall','Focus'],focus:['Over-excited'],duration:10,note:'Recall in garden — 60% success'},
    {date:now-D*10,score:3,skills:['Loose lead'],focus:['Calm and engaged'],duration:8,note:'Better lead walking!'},
    {date:now-D*9,score:4,skills:['Sit / Down','Stay'],focus:['Super focused'],duration:10,note:'5-second stay achieved!'},
    {date:now-D*8,score:3,skills:['Recall','Polite greeting'],focus:['Calm and engaged'],duration:12,note:'Lovely calm greeting with a visitor'},
    {date:now-D*7,score:5,skills:['Loose lead'],focus:['Easily distracted'],duration:8,note:'Tricky near other dogs'},
    {date:now-D*6,score:3,skills:['Recall','Sit / Down'],focus:['Super focused'],duration:10,note:'Best recall session yet!'},
    {date:now-D*5,score:2,skills:['Confidence games','Enrichment'],focus:['Calm and engaged'],duration:15,note:'Loved the muffin tin game'},
    {date:now-D*4,score:3,skills:['Stay','Polite greeting'],focus:['Super focused'],duration:10,note:'10-second stay!'},
    {date:now-D*3,score:2,skills:['Recall','Loose lead'],focus:['Calm and engaged'],duration:12,note:'Near-perfect park recall'},
    {date:now-D*2,score:3,skills:['Socialisation'],focus:['Calm and engaged'],duration:15,note:'Met 3 new dogs calmly'},
    {date:now-D*1,score:2,skills:['Recall','Stay'],focus:['Super focused'],duration:12,note:'Everything clicking today'},
    {date:now-0.3*D,score:2,skills:['Confidence games'],focus:['Calm and engaged'],duration:10,note:'Wobble board intro'},
  ];
  APP.streak = 7;
  APP.xp = 680;
  APP.completedLessons = ['l1_1','l1_2','l1_3','l1_4','l1_5','l2_1','l2_2'];
  save('fp_sessions', APP.sessions);
  save('fp_streak', 7);
  save('fp_xp', 680);
  save('fp_lessons', APP.completedLessons);
}

// ══════════════════════════════════════════════════════
//  THEME
// ══════════════════════════════════════════════════════
let isDark = load('fp_theme', false);
function applyTheme() {
  document.body.className = isDark ? 'theme-dark' : 'theme-light';
  $('theme-toggle').textContent = isDark ? '☀️' : '🌙';
}
applyTheme();
$('theme-toggle').addEventListener('click', () => {
  isDark = !isDark;
  save('fp_theme', isDark);
  applyTheme();
});

// ══════════════════════════════════════════════════════
//  TAB NAVIGATION
// ══════════════════════════════════════════════════════
const FP = window.FP = {};

FP.switchTab = function(tabId) {
  qsa('.tab-page').forEach(p => p.classList.remove('active'));
  qsa('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = $('tab-' + tabId);
  if (page) page.classList.add('active');

  const btn = qs(`.nav-btn[data-tab="${tabId}"]`);
  if (btn) btn.classList.add('active');

  window.scrollTo(0, 0);

  const renderers = {
    home:       renderHome,
    checkin:    renderCheckin,
    courses:    renderCourses,
    progress:   renderProgress,
    enrichment: () => renderEnrichment(APP.currentEnrichCat),
    coach:      initCoach,
  };
  if (renderers[tabId]) renderers[tabId]();
};

// ══════════════════════════════════════════════════════
//  STREAK BANNER
// ══════════════════════════════════════════════════════
function updateStreak() {
  const banner = $('streak-banner');
  const text   = $('streak-text');
  if (APP.streak > 0) {
    banner.style.display = 'flex';
    text.textContent = `${APP.streak}-day training streak — keep it up! 🔥`;
  } else {
    banner.style.display = 'none';
  }
}
function updateXP() {
  $('xp-chip').textContent = `⚡ ${APP.xp} XP`;
}

// ══════════════════════════════════════════════════════
//  HOME
// ══════════════════════════════════════════════════════
function renderHome() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  $('hero-greeting').textContent = greet + ' 👋';
  $('hero-dog-name').textContent = APP.dogName + '\'s Training Companion';

  // Tip
  $('tip-text').textContent = TIPS[new Date().getDate() % TIPS.length];

  // Today's tasks — derived from current module
  const mod = getCurrentModule();
  const moduleTasks = mod ? mod.lessons.slice(0, 3).map(l => '📌 ' + l.name) : [
    '🧠 10 marker word reps',
    '📣 10 recall calls in garden',
    '😌 5-min settle on mat',
  ];
  const taskEl = $('today-tasks');
  taskEl.innerHTML = moduleTasks.map((t, i) => `
    <div class="task-item" id="htask-${i}">
      <button class="task-check ${APP.tasks[i] ? 'done' : ''}" onclick="toggleHomeTask(${i})">${APP.tasks[i] ? '✓' : ''}</button>
      <span class="task-label ${APP.tasks[i] ? 'done' : ''}">${t}</span>
    </div>`).join('');

  // Milestones (most recently unlocked)
  const milestones = getMilestones();
  const recent = milestones.filter(m => m.unlocked).slice(-3);
  $('milestone-strip').innerHTML = recent.length
    ? recent.map(m => `<div class="milestone-chip">${m.icon} ${m.label}</div>`).join('')
    : '<div class="milestone-chip locked">🔒 Complete your first lesson to unlock milestones</div>';

  setTimeout(renderHomeChart, 60);
}

function toggleHomeTask(i) {
  APP.tasks[i] = !APP.tasks[i];
  save('fp_tasks_' + new Date().toDateString(), APP.tasks);
  if (APP.tasks[i]) { APP.xp += 10; save('fp_xp', APP.xp); updateXP(); showToast('✅ Task done! +10 XP'); }
  renderHome();
}

let homeChartType = 'progress';
FP.switchHomeChart = function(type, btn) {
  homeChartType = type;
  qsa('#tab-home .mini-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderHomeChart();
};
function renderHomeChart() {
  const canvas = $('home-chart');
  if (!canvas) return;
  const recent = APP.sessions.slice(-7);
  const labels = recent.map(s => ['Su','Mo','Tu','We','Th','Fr','Sa'][new Date(s.date).getDay()]);
  const data   = homeChartType === 'streak'
    ? recent.map((_, i) => i + 1)
    : recent.map(s => 10 - (s.score || 5));
  drawChart(canvas, labels, data, '#3a7d44', 'rgba(58,125,68,.14)', 90);
}

// ══════════════════════════════════════════════════════
//  CHECKIN (LOG SESSION)
// ══════════════════════════════════════════════════════
function renderCheckin() {
  buildScoreScale();
  $('feedback-card').style.display = 'none';
}

function buildScoreScale() {
  const container = $('score-scale');
  if (!container) return;
  container.innerHTML = '';
  APP.selectedScore = null;
  $('score-display').textContent = '–';
  $('score-context').textContent = '';
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'scale-btn';
    btn.textContent = i;
    btn.addEventListener('click', () => {
      qsa('#score-scale .scale-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      APP.selectedScore = i;
      $('score-display').textContent = i;
      const ctx = {0:'🌟 Perfect!',1:'🌟 Outstanding!',2:'✅ Brilliant',3:'✅ Great session',4:'🟡 Good effort',5:'🟡 Moderate',6:'🟠 Challenging',7:'🟠 Tough day',8:'🔴 Very hard',9:'🔴 Really tough',10:'🔴 Extremely difficult'};
      $('score-context').textContent = ctx[i] || '';
    });
    container.appendChild(btn);
  }
}

// Tag click handling
function initTagGroups() {
  qsa('#skills-tags .tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      const v = tag.getAttribute('data-v');
      const idx = APP.selectedSkills.indexOf(v);
      idx === -1 ? APP.selectedSkills.push(v) : APP.selectedSkills.splice(idx, 1);
    });
  });
  qsa('#focus-tags .tag').forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
      const v = tag.getAttribute('data-v');
      const idx = APP.selectedFocus.indexOf(v);
      idx === -1 ? APP.selectedFocus.push(v) : APP.selectedFocus.splice(idx, 1);
    });
  });
}

$('submit-session').addEventListener('click', () => {
  if (APP.selectedScore === null) { showToast('⚠️ Please rate your session first'); return; }

  const session = {
    date:     Date.now(),
    score:    APP.selectedScore,
    skills:   [...APP.selectedSkills],
    focus:    [...APP.selectedFocus],
    duration: parseInt($('duration-input').value) || 10,
    note:     $('session-note').value.trim(),
  };

  APP.sessions.unshift(session);
  APP.xp += 50;
  APP.streak++;
  save('fp_sessions', APP.sessions);
  save('fp_xp', APP.xp);
  save('fp_streak', APP.streak);
  updateXP();
  updateStreak();

  // Feedback
  const s = APP.selectedScore;
  const lvl = s <= 3 ? 'low' : s <= 6 ? 'mid' : 'high';
  const msgs = { low: 'Brilliant session! 🌟 Your dog performed superbly. Short, consistent sessions like this build the best foundation.', mid: 'Good effort! Some challenges, but great persistence. Follow up with an enrichment activity to wind down.', high: 'Tough session — completely normal. Every dog has off days. Keep it short and always end on a win.' };
  const tips = { low: '💡 Jackpot rewards (5–10 treats) on brilliant sessions signal to your dog they absolutely nailed it!', mid: '💡 Always end on something your dog can succeed at — even a simple sit restores confidence.', high: '💡 A 5-minute sniff walk on a long lead resets arousal far better than drilling exercises again.' };
  const bgs  = { low: '#d1fae5', mid: '#fef3c7', high: '#fee2e2' };
  const cols = { low: '#065f46', mid: '#92400e', high: '#991b1b' };
  const txts = { low: '🌟 Excellent session', mid: '✅ Good effort', high: '💪 Tough one' };

  const badge = $('feedback-badge');
  badge.textContent = txts[lvl];
  badge.style.background = bgs[lvl];
  badge.style.color = cols[lvl];
  $('feedback-msg').textContent = msgs[lvl];
  $('feedback-tip').textContent = tips[lvl];
  $('feedback-card').style.display = 'block';

  FP.resetCheckin();
  showToast('✅ Session saved! +50 XP 🔥');
  setTimeout(() => { if ($('feedback-card')) $('feedback-card').style.display = 'none'; }, 8000);
});

FP.resetCheckin = function() {
  APP.selectedScore = null;
  APP.selectedSkills = [];
  APP.selectedFocus = [];
  buildScoreScale();
  qsa('#skills-tags .tag, #focus-tags .tag').forEach(t => t.classList.remove('active'));
  $('duration-input').value = '';
  $('session-note').value = '';
};

// ══════════════════════════════════════════════════════
//  COURSES & LESSONS
// ══════════════════════════════════════════════════════
function getCurrentModule() {
  // Find the first module that has at least one incomplete lesson
  for (const mod of CURRICULUM) {
    const allDone = mod.lessons.every(l => APP.completedLessons.includes(l.id));
    if (!allDone) return mod;
  }
  return CURRICULUM[CURRICULUM.length - 1]; // all complete
}

function getLessonProgress() {
  const total   = CURRICULUM.reduce((s, m) => s + m.lessons.length, 0);
  const done    = APP.completedLessons.length;
  const modsDone = CURRICULUM.filter(m => m.lessons.every(l => APP.completedLessons.includes(l.id))).length;
  return { total, done, modsDone, pct: Math.round(done / total * 100) };
}

function renderCourses() {
  const prog = getLessonProgress();
  const curMod = getCurrentModule();

  // Header
  $('course-progress-header').innerHTML = `
    <div class="cph-title">🎓 Puppy Masterclass</div>
    <div class="cph-sub">${prog.done} of ${prog.total} lessons complete · ${prog.modsDone} modules finished</div>
    <div class="cph-prog-track"><div class="cph-prog-fill" style="width:${prog.pct}%"></div></div>
    <div class="cph-stats">
      <div><div class="cph-stat-val">${prog.pct}%</div><div class="cph-stat-lbl">Complete</div></div>
      <div><div class="cph-stat-val">${prog.done}</div><div class="cph-stat-lbl">Lessons done</div></div>
      <div><div class="cph-stat-val">${prog.modsDone}/5</div><div class="cph-stat-lbl">Modules</div></div>
    </div>`;

  // Module list
  const modList = $('modules-list');
  modList.innerHTML = '';

  CURRICULUM.forEach(mod => {
    const doneLessons = mod.lessons.filter(l => APP.completedLessons.includes(l.id)).length;
    const allDone     = doneLessons === mod.lessons.length;
    const isActive    = mod.id === curMod.id;
    const isLocked    = !allDone && !isActive && mod.id > curMod.id;
    const pct         = Math.round(doneLessons / mod.lessons.length * 100);

    const statusClass = allDone ? 'complete' : isActive ? 'active-m' : 'locked';
    const badgeText   = allDone ? '✅ Complete' : isActive ? '▶ In Progress' : '🔒 Locked';

    const card = document.createElement('div');
    card.className = 'module-card';
    card.innerHTML = `
      <div class="module-header" onclick="toggleModule(this)">
        <div class="module-num ${statusClass}">${allDone ? '✓' : mod.id}</div>
        <div style="flex:1">
          <div class="module-title">${mod.emoji} ${mod.name}</div>
          <div class="module-sub">${doneLessons}/${mod.lessons.length} lessons · ${mod.xp} XP</div>
        </div>
        <span class="module-badge ${statusClass}">${badgeText}</span>
        <span class="module-chevron">▼</span>
      </div>
      <div class="module-prog-bar-wrap">
        <div class="module-prog-label">${pct}% complete</div>
        <div class="module-prog-track"><div class="module-prog-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="module-lessons" id="mod-lessons-${mod.id}">
        ${mod.lessons.map((lesson, li) => {
          const done     = APP.completedLessons.includes(lesson.id);
          const isNextUp = !done && li === doneLessons && (isActive || !isLocked);
          const chkClass = done ? 'done' : isNextUp ? 'active-l' : '';
          return `
            <div class="lesson-item" onclick="toggleLesson('${lesson.id}', ${isLocked})" id="li-${lesson.id}">
              <div class="lesson-check ${chkClass}">${done ? '✓' : isNextUp ? '▶' : ''}</div>
              <div class="lesson-info">
                <div class="lesson-name ${done ? 'done' : ''}">${lesson.name}</div>
                <div class="lesson-desc">${lesson.desc}</div>
              </div>
              <span class="lesson-xp">+${lesson.xp} XP</span>
            </div>
            ${(done || isNextUp) ? `<div class="lesson-tip">💡 ${lesson.tip}</div>` : ''}`;
        }).join('')}
      </div>`;

    // Auto-open active module
    if (isActive || allDone) {
      card.classList.add('open');
    }

    modList.appendChild(card);
  });
}

function toggleModule(header) {
  const card = header.closest('.module-card');
  card.classList.toggle('open');
}

function toggleLesson(lessonId, isLocked) {
  if (isLocked) { showToast('🔒 Complete earlier modules first'); return; }

  const already = APP.completedLessons.includes(lessonId);
  if (already) {
    // Unmark
    APP.completedLessons = APP.completedLessons.filter(id => id !== lessonId);
    // Refund XP
    const lesson = CURRICULUM.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (lesson) { APP.xp = Math.max(0, APP.xp - lesson.xp); }
    showToast('↩ Lesson marked incomplete');
  } else {
    APP.completedLessons.push(lessonId);
    const lesson = CURRICULUM.flatMap(m => m.lessons).find(l => l.id === lessonId);
    if (lesson) {
      APP.xp += lesson.xp;
      showToast(`🎉 Lesson complete! +${lesson.xp} XP`);
    }
    // Check module completion
    const mod = CURRICULUM.find(m => m.lessons.some(l => l.id === lessonId));
    if (mod && mod.lessons.every(l => APP.completedLessons.includes(l.id))) {
      setTimeout(() => showToast(`🏅 Module ${mod.id} complete! +${mod.xp} bonus XP 🎉`), 1200);
      APP.xp += mod.xp;
    }
  }
  save('fp_lessons', APP.completedLessons);
  save('fp_xp', APP.xp);
  updateXP();
  renderCourses();
}

// ══════════════════════════════════════════════════════
//  PROGRESS
// ══════════════════════════════════════════════════════
function renderProgress() {
  const sessions = APP.sessions;
  const total    = sessions.length;
  const prog     = getLessonProgress();
  const avgRaw   = total ? sessions.reduce((s, ci) => s + (10 - ci.score), 0) / total : 0;
  const recent7  = sessions.slice(0, 7).reduce((s, ci) => s + (10 - ci.score), 0) / Math.min(7, total || 1);
  const prev7    = sessions.slice(7, 14);
  const prevAvg  = prev7.length ? prev7.reduce((s, ci) => s + (10 - ci.score), 0) / prev7.length : recent7;
  const trend    = Math.round((recent7 - prevAvg) / (prevAvg || 1) * 100);

  $('progress-stats').innerHTML = `
    <div class="stat-card"><div class="stat-val">${avgRaw.toFixed(1)}</div><div class="stat-lbl">Avg Score</div></div>
    <div class="stat-card"><div class="stat-val">${total}</div><div class="stat-lbl">Sessions</div></div>
    <div class="stat-card"><div class="stat-val">🔥 ${APP.streak}</div><div class="stat-lbl">Streak</div></div>
    <div class="stat-card"><div class="stat-val" style="color:${trend>=0?'var(--low)':'var(--high)'}">${trend>=0?'↑':'↓'}${Math.abs(trend)}%</div><div class="stat-lbl">This Week</div></div>
    <div class="stat-card"><div class="stat-val">${prog.done}</div><div class="stat-lbl">Lessons Done</div></div>
    <div class="stat-card"><div class="stat-val">${prog.pct}%</div><div class="stat-lbl">Course Progress</div></div>`;

  setTimeout(() => renderProgressChart('score'), 60);
  renderMilestonesFull();
  renderHistoryList();
}

let progressChartType = 'score';
FP.switchProgressChart = function(type, btn) {
  progressChartType = type;
  qsa('#tab-progress .mini-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProgressChart(type);
};
function renderProgressChart(type) {
  const canvas = $('progress-chart');
  if (!canvas) return;
  const slice = APP.sessions.slice(0, 14).reverse();
  const labels = slice.map(s => { const d = new Date(s.date); return `${d.getDate()}/${d.getMonth()+1}`; });
  let data, color, fill;
  if (type === 'score') {
    data  = slice.map(s => 10 - (s.score || 5));
    color = '#3a7d44'; fill = 'rgba(58,125,68,.13)';
  } else {
    // skill variety per session
    data  = slice.map(s => (s.skills||[]).length * 20);
    color = '#f4a435'; fill = 'rgba(244,164,53,.13)';
  }
  drawChart(canvas, labels, data, color, fill, 140);
}

function getMilestones() {
  const s = APP.sessions;
  return [
    { id:'m1', icon:'🎉', label:'First session logged',                unlocked: s.length >= 1,   xp: 50  },
    { id:'m2', icon:'🔥', label:'3-day training streak',               unlocked: APP.streak >= 3, xp: 100 },
    { id:'m3', icon:'🌟', label:'7-day training streak',               unlocked: APP.streak >= 7, xp: 200 },
    { id:'m4', icon:'📋', label:'10 sessions completed',               unlocked: s.length >= 10,  xp: 150 },
    { id:'m5', icon:'📣', label:'Recall practised in a session',       unlocked: s.some(x => (x.skills||[]).includes('Recall')), xp: 100 },
    { id:'m6', icon:'⏸', label:'Stay skill practised',                unlocked: s.some(x => (x.skills||[]).includes('Stay')), xp: 100 },
    { id:'m7', icon:'🤝', label:'Polite greeting practised',           unlocked: s.some(x => (x.skills||[]).includes('Polite greeting')), xp: 100 },
    { id:'m8', icon:'🎓', label:'Module 1 complete',                   unlocked: CURRICULUM[0].lessons.every(l => APP.completedLessons.includes(l.id)), xp: 500 },
    { id:'m9', icon:'🏅', label:'Module 2 complete',                   unlocked: CURRICULUM[1].lessons.every(l => APP.completedLessons.includes(l.id)), xp: 600 },
    { id:'m10',icon:'🧩', label:'Enrichment activity completed',       unlocked: APP.completedActivities.length >= 1, xp: 50 },
    { id:'m11',icon:'🌱', label:'5 different skills practised',        unlocked: new Set(s.flatMap(x=>x.skills||[])).size >= 5, xp: 200 },
    { id:'m12',icon:'🏆', label:'25 sessions logged',                  unlocked: s.length >= 25,  xp: 500 },
  ];
}

function renderMilestonesFull() {
  const milestones = getMilestones();
  $('milestones-full').innerHTML = `<div class="milestones-list">${milestones.map(m => `
    <div class="milestone-row ${m.unlocked ? 'unlocked' : ''}">
      <span class="ms-icon">${m.unlocked ? m.icon : '🔒'}</span>
      <span class="ms-label">${m.label}</span>
      ${m.unlocked ? `<span class="ms-xp">+${m.xp} XP</span>` : `<span class="ms-locked-lbl">Locked</span>`}
    </div>`).join('')}</div>`;
}

function renderHistoryList() {
  const el = $('history-list');
  if (!el) return;
  if (!APP.sessions.length) {
    el.innerHTML = '<p class="empty-msg">No sessions yet — log your first one! 🐾</p>';
    return;
  }
  el.innerHTML = APP.sessions.slice(0, 12).map(s => {
    const d   = new Date(s.date);
    const inv = 10 - s.score;
    const bg  = inv >= 8 ? '#d1fae5' : inv >= 5 ? '#fef3c7' : '#fee2e2';
    const col = inv >= 8 ? '#065f46' : inv >= 5 ? '#92400e' : '#991b1b';
    return `<div class="h-item">
      <div class="h-score" style="background:${bg};color:${col}">${inv}/10</div>
      <div class="h-meta">
        <div class="h-date">${d.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'})} · ${s.duration}min</div>
        <div class="h-tags">${(s.skills||[]).map(sk=>`<span class="h-tag">${sk}</span>`).join('')}</div>
        ${s.note ? `<div class="h-note">${s.note}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════════
//  ENRICHMENT
// ══════════════════════════════════════════════════════
FP.filterEnrichment = function(cat, btn) {
  APP.currentEnrichCat = cat;
  qsa('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEnrichment(cat);
};

function renderEnrichment(cat) {
  const list = cat === 'all' ? ENRICHMENT : ENRICHMENT.filter(e => e.cat === cat);
  const container = $('enrichment-cards');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(e => {
    const done = APP.completedActivities.includes(e.id);
    const div  = document.createElement('div');
    div.className = `enrich-card${done ? ' done' : ''}`;
    div.innerHTML = `
      <div class="enrich-icon">${e.icon}</div>
      <div class="enrich-info">
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
        <div class="enrich-meta">
          <span class="enrich-pill">⏱ ${e.time}</span>
          <span class="enrich-pill">${e.level}</span>
        </div>
        <div class="enrich-tip">${e.tip}</div>
      </div>
      <div class="enrich-side">
        ${done
          ? `<div class="done-badge">✅ Done</div>`
          : `<button class="btn-start" onclick="startActivity('${e.id}')">Start</button>`}
      </div>`;
    container.appendChild(div);
  });
}

function startActivity(id) {
  const act = ENRICHMENT.find(e => e.id === id);
  if (!act) return;
  if (act.instant) {
    showToast(act.instant);
    markActivityDone(id);
    return;
  }
  runActivity(act);
}

function runActivity(act) {
  const overlay = $('activity-runner');
  $('runner-title').textContent = act.name;
  overlay.style.display = 'flex';

  let cycleIdx = 0, phaseIdx = 0, timer = null;
  const maxCycles = act.cycles || 3;

  function runPhase() {
    if (cycleIdx >= maxCycles) { finishActivity(act.id); return; }
    const phase = act.phases[phaseIdx % act.phases.length];
    const circle = $('runner-circle');
    circle.className = 'runner-circle ' + phase.c;
    $('runner-instruction').textContent = phase.l;
    $('runner-progress-txt').textContent = `Round ${cycleIdx + 1} of ${maxCycles}`;

    let t = phase.d;
    $('runner-timer').textContent = t;
    clearInterval(timer);
    timer = setInterval(() => {
      t--;
      $('runner-timer').textContent = t;
      if (t <= 0) {
        clearInterval(timer);
        phaseIdx++;
        if (phaseIdx % act.phases.length === 0) cycleIdx++;
        runPhase();
      }
    }, 1000);
  }
  runPhase();

  $('runner-stop-btn').onclick = () => {
    clearInterval(timer);
    overlay.style.display = 'none';
    markActivityDone(act.id);
    showToast('🎉 Activity complete! +30 XP 🧩');
  };
}

function finishActivity(id) {
  $('activity-runner').style.display = 'none';
  markActivityDone(id);
  showToast('🎉 Activity complete! +30 XP 🧩');
}

function markActivityDone(id) {
  if (!APP.completedActivities.includes(id)) {
    APP.completedActivities.push(id);
    APP.xp += 30;
    save('fp_acts', APP.completedActivities);
    save('fp_xp', APP.xp);
    updateXP();
  }
  renderEnrichment(APP.currentEnrichCat);
}

// ══════════════════════════════════════════════════════
//  AI COACH
// ══════════════════════════════════════════════════════
function initCoach() {
  if (APP.coachReady) return;
  APP.coachReady = true;

  addMsg('bot', `Hi there! 👋 I'm your Four Paws AI Training Coach. Ask me about ${APP.dogName}'s training, any behaviour challenge, or what to do next in your course. I'm here to help.`);

  // Quick buttons
  $('coach-quick-btns').innerHTML = QUICK_TOPICS.slice(0, 5).map(q =>
    `<button class="coach-quick-btn" onclick="askCoach('${q.replace(/'/g,"\\'")}')">⚡ ${q}</button>`
  ).join('');

  // Full quick topics
  $('quick-topics').innerHTML = QUICK_TOPICS.map(q =>
    `<button class="quick-topic-btn" onclick="askCoach('${q.replace(/'/g,"\\'")}')">💬 ${q}</button>`
  ).join('');

  $('coach-send-btn').addEventListener('click', sendCoach);
  $('coach-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendCoach(); });
}

function addMsg(role, text) {
  const chat = $('coach-chat');
  const div  = document.createElement('div');
  div.className = `chat-msg ${role === 'user' ? 'chat-user' : 'chat-bot'}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function sendCoach() {
  const inp = $('coach-input');
  const q   = inp.value.trim();
  if (!q) return;
  addMsg('user', q);
  inp.value = '';
  setTimeout(() => {
    const lq  = q.toLowerCase();
    let resp  = `That's a great question. My core advice: keep sessions under 5 minutes, always end on success, and stay consistent. If this is a persistent challenge, log a session and mention it in the notes so your trainer can see it.`;
    Object.entries(AI_RESP).forEach(([k, v]) => { if (lq.includes(k)) resp = v; });
    addMsg('bot', resp);
  }, 700);
}

function askCoach(q) {
  const inp = $('coach-input');
  inp.value = q;
  sendCoach();
}

// ══════════════════════════════════════════════════════
//  CHART
// ══════════════════════════════════════════════════════
function drawChart(canvas, labels, data, color, fill, height) {
  if (!canvas || !data.length) return;
  const W   = canvas.offsetWidth || canvas.parentElement.offsetWidth || 340;
  const H   = height || 90;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const pad = { t: 14, r: 16, b: 20, l: 28 };
  const cw  = W - pad.l - pad.r;
  const ch  = H - pad.t - pad.b;
  const mn  = 0;
  const mx  = Math.max(...data, 10);
  const sx  = i => pad.l + i * (cw / (data.length - 1 || 1));
  const sy  = v => pad.t + ch - ((v - mn) / (mx - mn || 1)) * ch;

  // Grid lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)';
  ctx.lineWidth = 1;
  for (let g = 0; g <= 3; g++) {
    const gy = pad.t + ch * (g / 3);
    ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(pad.l + cw, gy); ctx.stroke();
  }

  // Area fill
  ctx.beginPath();
  data.forEach((v, i) => { i === 0 ? ctx.moveTo(sx(i), sy(v)) : ctx.lineTo(sx(i), sy(v)); });
  ctx.lineTo(sx(data.length - 1), pad.t + ch);
  ctx.lineTo(sx(0), pad.t + ch);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  data.forEach((v, i) => { i === 0 ? ctx.moveTo(sx(i), sy(v)) : ctx.lineTo(sx(i), sy(v)); });
  ctx.stroke();

  // Dots
  data.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(sx(i), sy(v), 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(sx(i), sy(v), 2, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#121f14' : '#fff';
    ctx.fill();
  });

  // X labels
  ctx.fillStyle    = isDark ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.35)';
  ctx.font         = '10px system-ui';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'bottom';
  labels.forEach((l, i) => ctx.fillText(l, sx(i), H));
}

// ══════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════
let toastTimer;
function showToast(msg) {
  const existing = $('fp-toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.id        = 'fp-toast';
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3000);
}

// ══════════════════════════════════════════════════════
//  SERVICE WORKER
// ══════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./ap3x-sw.js').catch(() => {});
}

// ══════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════
updateXP();
updateStreak();
initTagGroups();
renderHome();
