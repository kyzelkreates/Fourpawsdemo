/* ═══════════════════════════════════════════════════════════════
   FOUR PAWS ACADEMY — dataProvider.js
   Abstraction layer: localStorage now, Supabase-ready later.

   ALL reads and writes across both apps MUST go through here.
   To migrate to Supabase: set MODE = 'supabase' and fill
   SUPABASE_URL / SUPABASE_KEY — nothing else changes.
═══════════════════════════════════════════════════════════════ */

const FP_DATA = (function () {

  // ── Config ──────────────────────────────────────────────────
  const MODE         = 'local';          // 'local' | 'supabase'
  const SUPABASE_URL = '';               // paste when ready
  const SUPABASE_KEY = '';               // paste when ready

  // ── Namespace prefix — avoids key collisions ────────────────
  const NS = 'fp_';

  // ══════════════════════════════════════════════════════════
  //  LOCAL STORAGE ADAPTER
  // ══════════════════════════════════════════════════════════
  const local = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(NS + key);
        return v !== null ? JSON.parse(v) : fallback;
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch (_) {}
    },
    remove(key) {
      try { localStorage.removeItem(NS + key); } catch (_) {}
    },
    append(key, item, maxLen) {
      const arr = local.get(key, []);
      arr.unshift(item);
      if (maxLen && arr.length > maxLen) arr.length = maxLen;
      local.set(key, arr);
    },
  };

  // ══════════════════════════════════════════════════════════
  //  SUPABASE ADAPTER (wired, not active)
  //  Activate: set MODE='supabase', fill SUPABASE_URL/KEY above,
  //  then uncomment the import line below and the method bodies.
  // ══════════════════════════════════════════════════════════
  // import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
  // const _sb = createClient(SUPABASE_URL, SUPABASE_KEY)

  const supabase = {
    async get(table, query) {
      // const { data } = await _sb.from(table).select('*').match(query || {}).single()
      // return data
      return null;
    },
    async set(table, record) {
      // await _sb.from(table).upsert(record, { onConflict: 'id' })
    },
    async list(table, query) {
      // const { data } = await _sb.from(table).select('*').match(query || {})
      // return data || []
      return [];
    },
    async append(table, record) {
      // await _sb.from(table).insert(record)
    },
  };

  // ── Active adapter ──────────────────────────────────────────
  const isLocal = MODE === 'local';

  // ══════════════════════════════════════════════════════════
  //  PUBLIC API
  //  All keys are semantic — not raw localStorage keys.
  //  Map each to both adapters for easy future switch.
  // ══════════════════════════════════════════════════════════

  return {

    // ── Mode ─────────────────────────────────────────────────
    mode: MODE,
    isSupabaseReady: () => !!(SUPABASE_URL && SUPABASE_KEY),

    // ── Trainer profile ───────────────────────────────────────
    getTrainer: ()         => local.get('trainer', { name:'Alex Rivera', academy:'Four Paws Training & Enrichment Academy' }),
    setTrainer: (data)     => local.set('trainer', data),

    // ── Client / dog roster (Trainer OS writes) ───────────────
    getClients:  ()        => local.get('clients', []),
    setClients:  (list)    => local.set('clients', list),
    addClient:   (client)  => {
      const list = local.get('clients', []);
      list.push(client);
      local.set('clients', list);
    },
    getClient: (id)        => local.get('clients', []).find(c => c.id === id) || null,
    updateClient: (id, patch) => {
      const list = local.get('clients', []);
      const i = list.findIndex(c => c.id === id);
      if (i > -1) { list[i] = { ...list[i], ...patch }; local.set('clients', list); }
    },

    // ── Dog profiles ──────────────────────────────────────────
    getDogs:  ()           => local.get('dogs', []),
    setDogs:  (list)       => local.set('dogs', list),
    getDog:   (id)         => local.get('dogs', []).find(d => d.id === id) || null,
    addDog:   (dog)        => {
      const list = local.get('dogs', []);
      list.push(dog);
      local.set('dogs', list);
    },
    updateDog: (id, patch) => {
      const list = local.get('dogs', []);
      const i = list.findIndex(d => d.id === id);
      if (i > -1) { list[i] = { ...list[i], ...patch }; local.set('dogs', list); }
    },

    // ── Assigned lessons (Trainer writes, Owner reads) ────────
    getAssignedLessons:  (dogId) => local.get('lessons_' + dogId, []),
    setAssignedLessons:  (dogId, lessons) => local.set('lessons_' + dogId, lessons),

    // ── Owner session logs (Owner writes, Trainer reads) ──────
    getSessions:  (dogId)  => local.get('sessions_' + dogId, []),
    addSession:   (dogId, session) => local.append('sessions_' + dogId, session, 500),

    // ── Owner progress / milestones ───────────────────────────
    getProgress:  (dogId)  => local.get('progress_' + dogId, {}),
    setProgress:  (dogId, data) => local.set('progress_' + dogId, data),

    // ── Owner goals ───────────────────────────────────────────
    getGoals:  (dogId)     => local.get('goals_' + dogId, []),
    setGoals:  (dogId, goals) => local.set('goals_' + dogId, goals),

    // ── Owner journal ─────────────────────────────────────────
    getJournal:  (dogId)   => local.get('journal_' + dogId, []),
    addJournal:  (dogId, entry) => local.append('journal_' + dogId, entry, 200),

    // ── Enrichment completions ────────────────────────────────
    getEnrichDone: (dogId) => local.get('enrich_' + dogId, []),
    addEnrichDone: (dogId, actId) => {
      const list = local.get('enrich_' + dogId, []);
      if (!list.includes(actId)) { list.push(actId); local.set('enrich_' + dogId, list); }
    },

    // ── Trainer notes ─────────────────────────────────────────
    getNotes:  (dogId)     => local.get('notes_' + dogId, []),
    addNote:   (dogId, note) => local.append('notes_' + dogId, note, 100),

    // ── PWA events (install analytics) ───────────────────────
    getPWAEvents:  ()      => local.get('pwa_events', []),
    addPWAEvent:   (evt)   => local.append('pwa_events', evt, 500),
    clearPWAEvents: ()     => local.remove('pwa_events'),

    // ── Trainer theme ─────────────────────────────────────────
    getTrainerTheme: ()    => local.get('trainer_theme', ''),
    setTrainerTheme: (v)   => local.set('trainer_theme', v),

    // ── Owner theme ───────────────────────────────────────────
    getOwnerTheme: ()      => local.get('owner_theme', ''),
    setOwnerTheme: (v)     => local.set('owner_theme', v),

    // ── Active dog (Owner portal current dog) ─────────────────
    getActiveDogId: ()     => local.get('active_dog', null),
    setActiveDogId: (id)   => local.set('active_dog', id),

    // ── Client access codes (Trainer generates) ───────────────
    getAccessCodes: ()     => local.get('access_codes', []),
    addAccessCode:  (code) => local.append('access_codes', code, 100),
    validateCode:   (code) => {
      const codes = local.get('access_codes', []);
      return codes.find(c => c.code === code) || null;
    },

    // ── Tour completion ───────────────────────────────────────
    isTourDone: ()         => local.get('tour_done', false),
    setTourDone: ()        => local.set('tour_done', true),

    // ── Raw access (escape hatch — use sparingly) ─────────────
    _raw: local,

  };

})();

// Make globally available
if (typeof window !== 'undefined') window.FP_DATA = FP_DATA;
