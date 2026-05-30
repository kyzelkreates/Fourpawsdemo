/* ═══════════════════════════════════════════════════════════════
   FOUR PAWS TRAINING & ENRICHMENT ACADEMY
   storage.js — Single Source of Truth (SSOT)

   ALL data reads and writes for both apps pass through here.
   This replaces:
     - CURRICULUM const in owner-demo.html
     - MODULES const in trainer-demo.html
     - Raw localStorage calls in both files

   Supabase migration path: replace _storage adapter below.
   Nothing else changes.
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   CANONICAL COURSE STRUCTURE — Puppy Masterclass
   4 modules. This is the ONLY definition. Do not duplicate.
───────────────────────────────────────────────────────────────*/
const FP_COURSE = {
  id: 'puppy-masterclass',
  name: 'Puppy Masterclass',
  modules: [
    {
      id: 'm1', n: 1,
      name: 'Foundation & Bonding',
      emoji: '🌱',
      lessons: [
        { id:'m1_l1', name:'Trust Building',            desc:'Establishing a safe, predictable bond through consistent reward and calm handling.',       tip:'Every gentle, predictable interaction builds trust — the foundation of all training.',  xp:50 },
        { id:'m1_l2', name:'Name Recognition',           desc:'Teaching your dog their name means "look at me" — the gateway to all communication.',    tip:'Say the name once, reward the eye contact. Never repeat it to get attention.',         xp:50 },
        { id:'m1_l3', name:'Marker Word Training',       desc:'Introducing a consistent yes-marker or clicker to mark the exact moment of success.',   tip:'Your marker must always be followed by a reward — no exceptions, ever.',              xp:60 },
        { id:'m1_l4', name:'Focus & Attention',          desc:'Teaching your dog to voluntarily check in with you in low-distraction environments.',    tip:'Reward every offered glance — your dog choosing to look at you is gold.',             xp:60 },
        { id:'m1_l5', name:'Calm State Foundations',     desc:'Building a settle cue, reducing arousal, and rewarding stillness.',                     tip:'Calm is a behaviour. Reward it whenever it happens — even by accident.',              xp:80 },
      ]
    },
    {
      id: 'm2', n: 2,
      name: 'Core Obedience',
      emoji: '🎯',
      lessons: [
        { id:'m2_l1', name:'Sit & Down',                 desc:'Building reliable sit and down in multiple environments with 20+ reps each.',            tip:'A reliable sit means 9 out of 10 responses, anywhere you ask.',                      xp:60 },
        { id:'m2_l2', name:'Recall Foundations',         desc:'Teaching "come" as the most rewarding thing in your dog\'s world.',                     tip:'Never call your dog to anything unpleasant. Protect that recall cue with your life.', xp:80 },
        { id:'m2_l3', name:'Leash Basics',               desc:'Teaching your dog a loose lead means the walk continues.',                              tip:'Reward at your hip, not out in front. Movement is the reward.',                       xp:80 },
        { id:'m2_l4', name:'Calm Door Behaviour',        desc:'No rushing, no jumping — a controlled exit and entry routine.',                         tip:'Your dog only moves through a doorway when all four paws are on the floor.',          xp:60 },
        { id:'m2_l5', name:'Polite Greetings',           desc:'Four paws on the floor when meeting people and dogs.',                                  tip:'End the greeting the instant jumping begins — calmness earns the attention.',         xp:70 },
      ]
    },
    {
      id: 'm3', n: 3,
      name: 'Behaviour & Control',
      emoji: '🧠',
      lessons: [
        { id:'m3_l1', name:'Bite Inhibition',            desc:'Teaching your puppy to control jaw pressure during play and interaction.',               tip:'A yelp and a pause teaches more than any punishment — consistency is everything.',    xp:70 },
        { id:'m3_l2', name:'Socialisation Exposure',     desc:'Structured, positive introductions to other dogs, people and environments.',            tip:'One calm positive interaction beats twenty chaotic ones.',                            xp:80 },
        { id:'m3_l3', name:'Reducing Overstimulation',   desc:'Managing arousal in high-distraction environments and busy settings.',                  tip:'A sniff walk is the best pre-session calm-down. Let them nose.',                     xp:80 },
        { id:'m3_l4', name:'Distraction Proofing',       desc:'Maintaining focus and compliance when the environment becomes interesting.',            tip:'Work below threshold always. If your dog can\'t respond, you\'re too close.',         xp:80 },
        { id:'m3_l5', name:'Impulse Control',            desc:'Leave it, wait, and stay — building the ability to pause before reacting.',             tip:'The dog who can wait is the dog who can cope. Impulse control transfers everywhere.',  xp:90 },
      ]
    },
    {
      id: 'm4', n: 4,
      name: 'Real World Application',
      emoji: '🌍',
      lessons: [
        { id:'m4_l1', name:'Real World Recall',          desc:'Recall under distraction, at distance, and in novel environments.',                     tip:'Recall on a long line first. Never test off-lead until the on-lead version is solid.', xp:90 },
        { id:'m4_l2', name:'On-Lead Street Skills',      desc:'Loose lead walking past people, dogs, traffic and distractions.',                      tip:'High-value rewards only on difficult streets. Save them for the hard moments.',       xp:80 },
        { id:'m4_l3', name:'Café & Public Spaces',       desc:'Settle in public spaces — cafés, parks, waiting rooms.',                               tip:'Bring a lick mat. A busy mouth is a calm dog.',                                      xp:70 },
        { id:'m4_l4', name:'Enrichment Planning',        desc:'Building a sustainable weekly enrichment plan — sniff, puzzle, play, confidence.',     tip:'Aim for one scent, one puzzle, one play, one confidence challenge every 48 hours.',   xp:80 },
        { id:'m4_l5', name:'Long-Term Habit Building',   desc:'Maintaining skills over time with variable reinforcement and continued challenge.',     tip:'Vary reward timing after a behaviour is solid. Unpredictability keeps dogs sharp.',    xp:90 },
      ]
    },
  ]
};

/* ─────────────────────────────────────────────────────────────
   STORAGE ADAPTER
   Swap this for Supabase adapter without changing anything else.
───────────────────────────────────────────────────────────────*/
const _store = {
  NS: 'fp2_',   // fp2_ prefix — avoids collision with old fp_ keys
  get(key, fallback) {
    try {
      const v = localStorage.getItem(this.NS + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch (_) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(this.NS + key, JSON.stringify(value)); } catch (_) {}
  },
  remove(key) {
    try { localStorage.removeItem(this.NS + key); } catch (_) {}
  },
  append(key, item, maxLen) {
    const arr = this.get(key, []);
    arr.unshift(item);
    if (maxLen && arr.length > maxLen) arr.length = maxLen;
    this.set(key, arr);
  },
};

/* ─────────────────────────────────────────────────────────────
   PUBLIC API — FP_STORE
───────────────────────────────────────────────────────────────*/
const FP_STORE = {

  // ── Course access ───────────────────────────────────────────
  getCourse:   ()          => FP_COURSE,
  getModules:  ()          => FP_COURSE.modules,
  getModule:   (id)        => FP_COURSE.modules.find(m => m.id === id) || null,
  getAllLessons: ()         => FP_COURSE.modules.flatMap(m => m.lessons),
  getLesson:   (id)        => FP_COURSE.modules.flatMap(m => m.lessons).find(l => l.id === id) || null,

  // ── Dog profile (set by trainer deploy, read by owner PWA) ──
  getDogProfile: ()        => _store.get('dog_profile', { name:'Your Dog', breed:'', age:'', trainerId:'' }),
  setDogProfile: (data)    => _store.set('dog_profile', data),

  // ── Trainer profile ─────────────────────────────────────────
  getTrainer: ()           => _store.get('trainer', { name:'Four Paws Academy', notes:'' }),
  setTrainer: (data)       => _store.set('trainer', data),

  // ── Lesson completions (owner writes, trainer reads) ────────
  getCompletedLessons: ()  => _store.get('completed_lessons', []),
  setCompletedLessons: (a) => _store.set('completed_lessons', a),
  markLessonDone: (id) => {
    const list = _store.get('completed_lessons', []);
    if (!list.includes(id)) {
      list.push(id);
      _store.set('completed_lessons', list);
    }
    return list;
  },
  markLessonUndone: (id) => {
    const list = _store.get('completed_lessons', []).filter(x => x !== id);
    _store.set('completed_lessons', list);
    return list;
  },
  isLessonDone: (id)       => _store.get('completed_lessons', []).includes(id),
  isModuleDone: (moduleId) => {
    const mod = FP_COURSE.modules.find(m => m.id === moduleId);
    if (!mod) return false;
    const done = _store.get('completed_lessons', []);
    return mod.lessons.every(l => done.includes(l.id));
  },
  getCourseProgress: () => {
    const done  = _store.get('completed_lessons', []);
    const total = FP_COURSE.modules.flatMap(m => m.lessons).length;
    return { done: done.length, total, pct: total > 0 ? Math.round(done.length / total * 100) : 0 };
  },
  getCurrentModule: () => {
    const done = _store.get('completed_lessons', []);
    return FP_COURSE.modules.find(m => !m.lessons.every(l => done.includes(l.id))) || FP_COURSE.modules[FP_COURSE.modules.length - 1];
  },
  getNextLesson: () => {
    const done   = _store.get('completed_lessons', []);
    const curMod = FP_COURSE.modules.find(m => !m.lessons.every(l => done.includes(l.id)));
    return curMod ? curMod.lessons.find(l => !done.includes(l.id)) || null : null;
  },

  // ── Session check-ins (owner writes, trainer reads) ─────────
  getSessions: ()          => _store.get('sessions', []),
  addSession: (session) => {
    _store.append('sessions', { ...session, id: 'sess_' + Date.now(), ts: Date.now() }, 500);
  },

  // ── Goals ───────────────────────────────────────────────────
  getGoals: ()             => _store.get('goals', []),
  setGoals: (goals)        => _store.set('goals', goals),

  // ── Journal ─────────────────────────────────────────────────
  getJournal: ()           => _store.get('journal', []),
  addJournal: (entry)      => _store.append('journal', { ...entry, id: 'j_' + Date.now(), ts: Date.now() }, 200),

  // ── Enrichment completions ───────────────────────────────────
  getEnrichDone: ()        => _store.get('enrich_done', []),
  setEnrichDone: (list)    => _store.set('enrich_done', list),
  markEnrichDone: (id) => {
    const list = _store.get('enrich_done', []);
    if (!list.includes(id)) { list.push(id); _store.set('enrich_done', list); }
  },

  // ── Streak ──────────────────────────────────────────────────
  getStreak: ()            => _store.get('streak', 0),
  setStreak: (n)           => _store.set('streak', n),
  updateStreak: () => {
    const last = _store.get('last_session_day', null);
    const today = new Date().toDateString();
    if (last === today) return _store.get('streak', 0);
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const streak = last === yesterday ? (_store.get('streak', 0) + 1) : 1;
    _store.set('streak', streak);
    _store.set('last_session_day', today);
    return streak;
  },

  // ── Deployed clients (trainer writes) ──────────────────────
  getClients: ()           => _store.get('clients', []),
  addClient: (client)      => _store.append('clients', { ...client, id: 'c_' + Date.now() }, 100),
  getClient: (code)        => _store.get('clients', []).find(c => c.code === code) || null,
  updateClientStatus: (code, status) => {
    const clients = _store.get('clients', []);
    const i = clients.findIndex(c => c.code === code);
    if (i > -1) { clients[i].status = status; _store.set('clients', clients); }
  },

  // ── Access codes ────────────────────────────────────────────
  generateCode: () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },

  // ── PWA events (install analytics) ──────────────────────────
  getPWAEvents: ()         => _store.get('pwa_events', []),
  addPWAEvent: (evt)       => _store.append('pwa_events', { ...evt, id: 'e_' + Date.now() }, 500),
  clearPWAEvents: ()       => _store.remove('pwa_events'),

  // ── Preferences ─────────────────────────────────────────────
  getTheme: (app)          => _store.get('theme_' + app, ''),
  setTheme: (app, v)       => _store.set('theme_' + app, v),

  // ── Tour ────────────────────────────────────────────────────
  isTourDone: ()           => _store.get('tour_done', false),
  setTourDone: ()          => _store.set('tour_done', true),


  // ── AI Sync Payloads (Owner PWA writes, Trainer reads) ───────
  // Schema: v1.0 structured payload per AI_SYNC_SCHEMA
  getSyncPayloads: ()       => _store.get('sync_payloads', []),
  getLatestSync: ()         => {
    const p = _store.get('sync_payloads', []);
    return p.length ? p[0] : null;
  },
  addSyncPayload: (payload) => {
    // Keep latest 50 payloads per client — trainer reads these
    const all = _store.get('sync_payloads', []);
    all.unshift(payload);
    if (all.length > 50) all.length = 50;
    _store.set('sync_payloads', all);
  },
  getSyncPayloadsByClient: (clientId) => {
    return _store.get('sync_payloads', []).filter(p => p.client && p.client.clientId === clientId);
  },
  clearSyncPayloads: ()     => _store.remove('sync_payloads'),
  getLastSyncTs: ()         => _store.get('last_sync_ts', null),
  setLastSyncTs: (ts)       => _store.set('last_sync_ts', ts),

  // ── Raw escape hatch ────────────────────────────────────────
  _raw: _store,
};

if (typeof window !== 'undefined') {
  window.FP_STORE  = FP_STORE;
  window.FP_COURSE = FP_COURSE;
}
