/* ═══════════════════════════════════════════════
   FOUR PAWS TRAINING COMPANION — Shared JS
   State, data, utilities — loaded on every page
════════════════════════════════════════════════ */
'use strict';

// ── Helpers ───────────────────────────────────────────
function $ (id)       { return document.getElementById(id); }
function qs(sel)      { return document.querySelector(sel); }
function qsa(sel)     { return document.querySelectorAll(sel); }
function save(k,v)    { try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
function load(k,def)  { try{ const v=localStorage.getItem(k); return v!==null?JSON.parse(v):def; }catch(e){ return def; } }

// ── Puppy Masterclass curriculum ─────────────────────
const CURRICULUM = [
  { id:1, name:'Module 1 — Foundations', emoji:'🌱', xp:500, lessons:[
    {id:'l1_1',name:'Understanding Puppy Psychology',     desc:'How dogs learn, critical periods and building trust',              tip:'Puppies learn through association — make every interaction positive.',                         xp:50},
    {id:'l1_2',name:'Marker Word Training',               desc:'Introducing the clicker or verbal marker cue',                   tip:'Your marker word must always be followed by a reward — no exceptions.',                      xp:50},
    {id:'l1_3',name:'Focus & Attention Building',         desc:'Teaching your dog to check in with you voluntarily',             tip:'Reward every eye contact your dog offers. Capture it, don\'t prompt it.',                      xp:60},
    {id:'l1_4',name:'Reward Timing Fundamentals',         desc:'Mark the exact moment of the behaviour you want',                tip:'The reward must land within 1.5 seconds of the behaviour.',                                  xp:60},
    {id:'l1_5',name:'Calmness Foundations',               desc:'Building a settle cue and reducing arousal at home',             tip:'Reward any moment of stillness — even accidental.',                                           xp:80},
  ]},
  { id:2, name:'Module 2 — Core Obedience', emoji:'🎯', xp:600, lessons:[
    {id:'l2_1',name:'Sit & Down Reliability',             desc:'Building 20+ successful reps in multiple environments',          tip:'A reliable sit means 9/10 responses anywhere before moving on.',                             xp:60},
    {id:'l2_2',name:'Recall Foundations',                 desc:'Building the "come" cue as the most rewarding thing in the world',tip:'Never call your dog to something unpleasant. Protect that recall cue.',                    xp:80},
    {id:'l2_3',name:'Loose Lead Walking',                 desc:'Teaching your dog that a loose lead keeps the walk going',       tip:'Reward placement matters — treat at your hip, not out front.',                              xp:80},
    {id:'l2_4',name:'Calm Door Behaviour',                desc:'No rushing, no jumping — a controlled exit routine',             tip:'Your dog only gets what they want when all four paws are on the floor.',                    xp:60},
    {id:'l2_5',name:'Polite Greeting Skills',             desc:'Four paws on the floor when meeting people and dogs',            tip:'End the greeting the moment jumping begins.',                                                xp:70},
  ]},
  { id:3, name:'Module 3 — Socialisation & Confidence', emoji:'🌍', xp:700, lessons:[
    {id:'l3_1',name:'Environmental Confidence',           desc:'Exposing your dog to novel sounds, surfaces and environments',   tip:'Never force interaction. Let your dog choose to approach.',                                  xp:70},
    {id:'l3_2',name:'Positive Social Exposure',           desc:'Structured introductions to other dogs and people',             tip:'One calm positive interaction beats 20 chaotic ones.',                                       xp:80},
    {id:'l3_3',name:'Reducing Overstimulation',           desc:'Managing and lowering arousal in high-distraction environments', tip:'A sniff walk is the best pre-session warm-up.',                                              xp:80},
    {id:'l3_4',name:'New Experience Handling',            desc:'Vets, groomers, car travel — positive conditioning',            tip:'Work at the lowest intensity your dog is comfortable with.',                                 xp:70},
    {id:'l3_5',name:'Confidence Building Games',          desc:'Wobble boards, novel objects and exploration games',             tip:'Reward every moment of brave investigation, no matter how small.',                           xp:80},
  ]},
  { id:4, name:'Module 4 — Home Life Success', emoji:'🏠', xp:650, lessons:[
    {id:'l4_1',name:'Toilet Training System',             desc:'A consistent routine that ends accidents fast',                  tip:'Take outside every 45 mins, after every meal, sleep and play.',                             xp:60},
    {id:'l4_2',name:'Crate Confidence',                   desc:'Building a safe, voluntary retreat your dog loves',             tip:'Never lock the crate until your dog enters willingly.',                                      xp:70},
    {id:'l4_3',name:'Alone Time Training',                desc:'Preventing separation distress through gradual independence',   tip:'Start with 10 seconds literally. Build to 5 minutes before increasing to 15.',                xp:80},
    {id:'l4_4',name:'Reducing Destructive Behaviour',     desc:'Management, enrichment and appropriate outlets',                tip:'Management first — remove the opportunity. Then provide a better alternative.',               xp:70},
    {id:'l4_5',name:'Calm Household Behaviour',           desc:'Settle on mat, calm greetings and relaxed mealtimes',          tip:'Reward all calm moments — even accidental.',                                                 xp:70},
  ]},
  { id:5, name:'Module 5 — Enrichment & Long-Term Development', emoji:'🧩', xp:800, lessons:[
    {id:'l5_1',name:'Mental Stimulation Games',           desc:'Puzzle feeders, snuffle mats and problem-solving',              tip:'10 mins of mental work beats 30 mins of walking.',                                           xp:80},
    {id:'l5_2',name:'Structured Play Systems',            desc:'Using play as reinforcement — tug, chase and retrieve',         tip:'Make yourself more fun than the environment.',                                               xp:80},
    {id:'l5_3',name:'Scent Work Foundations',             desc:'Introducing nose work games and hide-and-seek',                 tip:'A dog who sniffs is a calm and happy dog.',                                                  xp:90},
    {id:'l5_4',name:'Long-Term Habit Reinforcement',      desc:'Maintaining skills under distraction, distance and duration',  tip:'The 3 Ds: duration, distance, distraction — only work on one at a time.',                    xp:80},
    {id:'l5_5',name:'Advanced Enrichment Planning',       desc:'Designing a weekly enrichment schedule for your dog',           tip:'Aim for: 1 scent, 1 puzzle, 1 confidence game, 1 play session every 48 hours.',              xp:90},
  ]},
];

// ── Enrichment activities ─────────────────────────────
const ENRICHMENT = [
  {id:'sniff',   cat:'scent',      icon:'👃', name:'Sniff Walk Timer',       desc:'Let your dog lead and sniff freely on a long lead',  time:'10 min', level:'Beginner',     tip:'Sniffing is 40× more tiring than walking.',                                          phases:[{l:'Walk & sniff freely',d:60,c:'inhale'},{l:'Pause & jackpot!',d:5,c:'exhale'}], cycles:4},
  {id:'scatter', cat:'scent',      icon:'🌿', name:'Scatter Feeding',        desc:'Scatter kibble in grass — activates nose instinct',   time:'5 min',  level:'Beginner',     tip:'Use their meal kibble. Slows eating, reduces stress.',                               phases:[{l:'Scatter kibble in grass',d:10,c:'hold'},{l:'Let them search!',d:60,c:'inhale'},{l:'Jackpot on last piece',d:5,c:'exhale'}], cycles:2},
  {id:'muffin',  cat:'puzzle',     icon:'🧁', name:'Muffin Tin Game',        desc:'Hide treats under tennis balls in a tin',             time:'5 min',  level:'Beginner',     tip:'Start with all cups visible, then hide some empty.',                                 phases:[{l:'Hide treats under balls',d:10,c:'hold'},{l:'Release — let them find!',d:30,c:'inhale'},{l:'Jackpot the find!',d:5,c:'exhale'}], cycles:3},
  {id:'lickmat', cat:'calm',       icon:'😋', name:'Lick Mat Calm-Down',     desc:'Spread food paste — promotes calm licking',           time:'10 min', level:'Beginner',     tip:'Licking releases serotonin. Use before training to lower arousal.',                  phases:[{l:'Dog licking calmly',d:120,c:'inhale'},{l:'Refill if needed',d:10,c:'hold'}], cycles:2},
  {id:'kong',    cat:'calm',       icon:'❄️', name:'Frozen Kong',            desc:'Stuff and freeze for extended mental stimulation',     time:'2 min',  level:'Beginner',     tip:'Freeze 2+ hours. Perfect for alone time.',                                           instant:'❄️ Stuff your Kong now and pop it in the freezer for 2+ hours!'},
  {id:'tug',     cat:'play',       icon:'🪢', name:'Structured Tug Play',    desc:'Controlled tug builds drive and impulse control',     time:'5 min',  level:'Intermediate', tip:'Always end with you holding the toy.',                                               phases:[{l:'Offer the tug toy',d:5,c:'inhale'},{l:'Active tug!',d:8,c:'inhale'},{l:'"Drop it" cue',d:3,c:'hold'},{l:'Reward & reset',d:5,c:'exhale'}], cycles:4},
  {id:'boxes',   cat:'confidence', icon:'📦', name:'Confidence Box Game',    desc:'Novel objects on ground — explore and reward',        time:'8 min',  level:'Intermediate', tip:'Never force interaction. Jackpot all brave moments.',                               phases:[{l:'Place object on floor',d:5,c:'hold'},{l:'Let dog investigate freely',d:15,c:'inhale'},{l:'Jackpot any contact!',d:5,c:'exhale'}], cycles:3},
  {id:'wobble',  cat:'confidence', icon:'🪨', name:'Wobble Board',           desc:'Build body awareness on unstable surfaces',           time:'8 min',  level:'Advanced',     tip:'Start flat, not wobbling. Reward 4 paws on.',                                        phases:[{l:'Lure all 4 paws on board',d:10,c:'hold'},{l:'Jackpot stillness',d:5,c:'exhale'},{l:'Gentle wobble',d:8,c:'inhale'},{l:'Reward calm!',d:5,c:'exhale'}], cycles:3},
  {id:'snuffle', cat:'scent',      icon:'🌀', name:'Snuffle Mat Feeding',    desc:'Feed entire meal through a snuffle mat',              time:'5 min',  level:'Beginner',     tip:'Jackpot when they persist past frustration.',                                        phases:[{l:'Spread food in mat',d:10,c:'hold'},{l:'Let them snuffle!',d:60,c:'inhale'},{l:'Reward persistence',d:5,c:'exhale'}], cycles:2},
  {id:'flirt',   cat:'play',       icon:'🎣', name:'Flirt Pole Chase',       desc:'Physical exercise + impulse control',                 time:'5 min',  level:'Intermediate', tip:'Short bursts only. Stop before they lose impulse control.',                          instant:'🎣 Move the flirt pole in 5–8 sec bursts. Stop before your dog loses impulse control. Reward calm stops with a treat!'},
];

// ── Daily tips ────────────────────────────────────────
const TIPS = [
  'Short, frequent sessions (5 min × 3) beat one long 30-minute session every time.',
  'Always end on a success — even a simple sit. It leaves your dog feeling confident.',
  'Your dog reads your energy. Calm owner = calm dog. Take a breath before you start.',
  'Jackpot rewards (5–10 treats at once) on brilliant moments teach your dog they nailed it.',
  'Sniffing is 40× more mentally tiring than walking. A sniff walk is a full brain workout.',
  'Never lure past rep 5 — fade the food so the dog learns the cue, not just the hand.',
  'Never call your dog to something unpleasant — protect that recall cue with your life.',
  'Enrichment before training = a calmer, more focused dog. Scatter feeding works brilliantly.',
  'If your dog doesn\'t respond in 3 seconds, reset and try in an easier environment.',
  'Consistency beats intensity. 5 minutes every day beats 2 hours on a Sunday.',
  'Confidence is built one tiny brave step at a time. Never rush socialisation.',
  'A mentally tired dog is the calmest, most biddable dog.',
];

// ── AI responses ──────────────────────────────────────
const AI_RESP = {
  'ankle biting':   'Ankle biting is play/mouthing behaviour. Yelp, freeze and turn away immediately. Offer a tug toy or chew as redirect. Every person in the household must respond the same way. Resolves by 4–5 months with consistent redirection and adequate sleep.',
  'barking':        'Barking at visitors: manage first (baby gate), teach a "go to mat" behaviour, then desensitise the doorbell from a distance. Never greet visitors until your dog is calm.',
  'recall':         'Build a "recall bank" — 20+ rewarded recalls daily in low-distraction environments before proofing outside. Use a unique cue, never overuse it, and jackpot every single return.',
  'enrichment':     'Today I\'d recommend: scatter feeding at breakfast, a lick mat before training, and a 10-minute sniff walk. These build focus, lower arousal and improve recall motivation.',
  'crate':          'Crate training fails when you go too fast. Start with the door open, feed all meals inside. Only close the door once your dog enters willingly. Build in 10-second increments.',
  'pulling':        'Reward at your hip, not out front. Use high-value treats. Reward every 3–5 steps without tension. Stop the instant the lead tightens.',
  'confidence':     'Confidence builds one tiny brave step at a time. Novel objects, dog chooses to approach. Never force. Jackpot all brave investigative behaviour.',
  'biting':         'Puppy biting: yelp, freeze, turn away. Redirect to a chew or tug. Reward gentle mouth. Ensure 16–18 hours sleep daily — tiredness increases biting dramatically.',
  'socialisation':  'Quality over quantity. Watch body language — lip licking, yawning, looking away all mean stress. Give space and reward all calm behaviour.',
  'focus':          'Reward check-ins — every time your dog glances at you voluntarily, mark and reward. Work in boring environments first.',
  'sit':            'For a reliable sit: 20+ reps in different locations. Fade the lure by rep 5. Proof garden → street → park. 9/10 response rate before moving on.',
  'stay':           'Build stay with 3 Ds: duration first, then distance, then distraction. Only ONE D at a time. Never leave on a failed stay.',
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

// ── App state (shared via localStorage) ──────────────
const APP = {
  get sessions()           { return load('fp_sessions', []); },
  get completedLessons()   { return load('fp_lessons', []); },
  get completedActivities(){ return load('fp_acts', []); },
  get streak()             { return load('fp_streak', 0); },
  get xp()                 { return load('fp_xp', 0); },
  get dogName()            { return load('fp_dog', 'Your Dog'); },
  set xp(v)                { save('fp_xp', v); },
  set streak(v)            { save('fp_streak', v); },
  addLesson(id) {
    const arr = this.completedLessons;
    if (!arr.includes(id)) { arr.push(id); save('fp_lessons', arr); return true; }
    return false;
  },
  removeLesson(id) {
    const arr = this.completedLessons.filter(x => x !== id);
    save('fp_lessons', arr);
  },
  addActivity(id) {
    const arr = this.completedActivities;
    if (!arr.includes(id)) { arr.push(id); save('fp_acts', arr); return true; }
    return false;
  },
  addSession(s) {
    const arr = this.sessions;
    arr.unshift(s);
    save('fp_sessions', arr);
  },
  get tasks() { return load('fp_tasks_' + new Date().toDateString(), [false,false,false]); },
  saveTask(i, v) { const t = this.tasks; t[i] = v; save('fp_tasks_' + new Date().toDateString(), t); },
};

// ── Seed demo data if empty ───────────────────────────
(function seedIfEmpty() {
  if (load('fp_seeded', false)) return;
  const now = Date.now(), D = 86400000;
  const sessions = [
    {date:now-D*13,score:5,skills:['Recall','Sit / Down'],focus:['Easily distracted'],duration:8,note:'First session — very excited!'},
    {date:now-D*12,score:4,skills:['Sit / Down'],focus:['Easily distracted'],duration:6,note:'Sit getting more reliable'},
    {date:now-D*11,score:6,skills:['Recall','Focus'],focus:['Over-excited'],duration:10,note:'Recall in garden — 60% success'},
    {date:now-D*10,score:3,skills:['Loose lead'],focus:['Calm and engaged'],duration:8,note:'Better lead walking!'},
    {date:now-D*9, score:4,skills:['Sit / Down','Stay'],focus:['Super focused'],duration:10,note:'5-second stay achieved!'},
    {date:now-D*8, score:3,skills:['Recall','Polite greeting'],focus:['Calm and engaged'],duration:12,note:'Lovely calm greeting'},
    {date:now-D*7, score:5,skills:['Loose lead'],focus:['Easily distracted'],duration:8,note:'Tricky near other dogs'},
    {date:now-D*6, score:3,skills:['Recall','Sit / Down'],focus:['Super focused'],duration:10,note:'Best recall session yet!'},
    {date:now-D*5, score:2,skills:['Confidence games','Enrichment'],focus:['Calm and engaged'],duration:15,note:'Loved the muffin tin game'},
    {date:now-D*4, score:3,skills:['Stay','Polite greeting'],focus:['Super focused'],duration:10,note:'10-second stay!'},
    {date:now-D*3, score:2,skills:['Recall','Loose lead'],focus:['Calm and engaged'],duration:12,note:'Near-perfect park recall'},
    {date:now-D*2, score:3,skills:['Socialisation'],focus:['Calm and engaged'],duration:15,note:'Met 3 new dogs calmly'},
    {date:now-D,   score:2,skills:['Recall','Stay'],focus:['Super focused'],duration:12,note:'Everything clicking today'},
    {date:now-0.3*D,score:2,skills:['Confidence games'],focus:['Calm and engaged'],duration:10,note:'Wobble board intro'},
  ];
  save('fp_sessions', sessions);
  save('fp_streak', 7);
  save('fp_xp', 680);
  save('fp_lessons', ['l1_1','l1_2','l1_3','l1_4','l1_5','l2_1','l2_2']);
  save('fp_seeded', true);
})();

// ── Theme ─────────────────────────────────────────────
let isDark = load('fp_theme', false);
function applyTheme() {
  document.body.className = isDark ? 'theme-dark' : 'theme-light';
  const tb = $('theme-toggle');
  if (tb) tb.textContent = isDark ? '☀️' : '🌙';
}
function toggleTheme() {
  isDark = !isDark; save('fp_theme', isDark); applyTheme();
}

// ── Streak banner ─────────────────────────────────────
function updateStreak() {
  const b = $('streak-banner'), t = $('streak-text');
  if (!b) return;
  if (APP.streak > 0) { b.style.display='flex'; t.textContent=`🔥 ${APP.streak}-day training streak — keep it up!`; }
  else { b.style.display='none'; }
}

// ── XP chip ───────────────────────────────────────────
function updateXP() {
  const c = $('xp-chip');
  if (c) c.textContent = `⚡ ${APP.xp} XP`;
}

// ── Toast ─────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const old = $('fp-toast');
  if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'fp-toast'; t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { if(t.parentNode) t.remove(); }, 3000);
}

// ── Chart ─────────────────────────────────────────────
function drawChart(canvas, labels, data, color, fill, height) {
  if (!canvas || !data.length) return;
  const W = canvas.offsetWidth || canvas.parentElement?.offsetWidth || 340;
  const H = height || 90;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,W,H);
  const pad = {t:14,r:16,b:20,l:28};
  const cw = W-pad.l-pad.r, ch = H-pad.t-pad.b;
  const mx = Math.max(...data,10), mn = 0;
  const sx = i => pad.l + i*(cw/(data.length-1||1));
  const sy = v => pad.t + ch - ((v-mn)/(mx-mn||1))*ch;
  // Grid
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)';
  ctx.lineWidth = 1;
  for (let g=0;g<=3;g++) { const gy=pad.t+ch*(g/3); ctx.beginPath(); ctx.moveTo(pad.l,gy); ctx.lineTo(pad.l+cw,gy); ctx.stroke(); }
  // Fill
  ctx.beginPath();
  data.forEach((v,i)=>{ i===0?ctx.moveTo(sx(i),sy(v)):ctx.lineTo(sx(i),sy(v)); });
  ctx.lineTo(sx(data.length-1),pad.t+ch); ctx.lineTo(sx(0),pad.t+ch); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  // Line
  ctx.beginPath(); ctx.strokeStyle=color; ctx.lineWidth=2.5; ctx.lineJoin='round';
  data.forEach((v,i)=>{ i===0?ctx.moveTo(sx(i),sy(v)):ctx.lineTo(sx(i),sy(v)); }); ctx.stroke();
  // Dots
  data.forEach((v,i)=>{
    ctx.beginPath(); ctx.arc(sx(i),sy(v),4,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    ctx.beginPath(); ctx.arc(sx(i),sy(v),2,0,Math.PI*2); ctx.fillStyle=isDark?'#121f14':'#fff'; ctx.fill();
  });
  // Labels
  ctx.fillStyle = isDark?'rgba(255,255,255,.35)':'rgba(0,0,0,.35)';
  ctx.font='10px system-ui'; ctx.textAlign='center'; ctx.textBaseline='bottom';
  labels.forEach((l,i)=>ctx.fillText(l,sx(i),H));
}

// ── Milestones ────────────────────────────────────────
function getMilestones() {
  const s = APP.sessions;
  return [
    {id:'m1', icon:'🎉', label:'First session logged',              unlocked:s.length>=1,   xp:50 },
    {id:'m2', icon:'🔥', label:'3-day training streak',             unlocked:APP.streak>=3, xp:100},
    {id:'m3', icon:'🌟', label:'7-day training streak',             unlocked:APP.streak>=7, xp:200},
    {id:'m4', icon:'📋', label:'10 sessions completed',             unlocked:s.length>=10,  xp:150},
    {id:'m5', icon:'📣', label:'Recall practised',                  unlocked:s.some(x=>(x.skills||[]).includes('Recall')), xp:100},
    {id:'m6', icon:'⏸', label:'Stay skill practised',              unlocked:s.some(x=>(x.skills||[]).includes('Stay')), xp:100},
    {id:'m7', icon:'🤝', label:'Polite greeting practised',         unlocked:s.some(x=>(x.skills||[]).includes('Polite greeting')), xp:100},
    {id:'m8', icon:'🎓', label:'Module 1 complete',                 unlocked:CURRICULUM[0].lessons.every(l=>APP.completedLessons.includes(l.id)), xp:500},
    {id:'m9', icon:'🏅', label:'Module 2 complete',                 unlocked:CURRICULUM[1].lessons.every(l=>APP.completedLessons.includes(l.id)), xp:600},
    {id:'m10',icon:'🧩', label:'Enrichment activity completed',     unlocked:APP.completedActivities.length>=1, xp:50},
    {id:'m11',icon:'🌱', label:'5 different skills practised',      unlocked:new Set(s.flatMap(x=>x.skills||[])).size>=5, xp:200},
    {id:'m12',icon:'🏆', label:'25 sessions logged',                unlocked:s.length>=25,  xp:500},
  ];
}

// ── Nav HTML builder ──────────────────────────────────
function buildNav(active) {
  const pages = [
    {id:'home',       href:'./index.html',      icon:'home',     label:'Home'},
    {id:'log',        href:'./log.html',         icon:'log',      label:'Log'},
    {id:'courses',    href:'./courses.html',     icon:'courses',  label:'Courses'},
    {id:'progress',   href:'./progress.html',    icon:'progress', label:'Progress'},
    {id:'enrichment', href:'./enrichment.html',  icon:'enrich',   label:'Enrich'},
    {id:'coach',      href:'./coach.html',       icon:'coach',    label:'Coach'},
  ];
  const icons = {
    home:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    log:      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>',
    courses:  '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    progress: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    enrich:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    coach:    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  };
  return `<nav class="bottom-nav">${pages.map(p=>`
    <a href="${p.href}" class="nav-btn${p.id===active?' active':''}" aria-label="${p.label}">
      ${icons[p.icon]}<span>${p.label}</span>
    </a>`).join('')}</nav>`;
}

// ── Init common ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  updateXP();
  updateStreak();
  const tb = $('theme-toggle');
  if (tb) tb.addEventListener('click', toggleTheme);
  // Inject nav
  const nav = $('fp-nav');
  if (nav) { const pg = document.body.getAttribute('data-page') || 'home'; nav.innerHTML = buildNav(pg); }
});
