/*─────────────────────────────────────────────────────
  FOUR PAWS — Data Provider
  Local-first. Swap SUPABASE_CONFIG to enable cloud sync.
  Architecture: Owner PWA writes → Trainer OS reads.
─────────────────────────────────────────────────────*/

/* ── Supabase config (fill in when ready) ── */
var SUPABASE_CONFIG = {
  enabled: false,
  url: '',
  anonKey: ''
};

/* ── PWA metrics store (Supabase-ready) ── */
var FP_PWA = {
  NS: 'fp_pwa_',
  _get: function(k, fb) { try { var v = localStorage.getItem(this.NS + k); return v !== null ? JSON.parse(v) : fb; } catch(_) { return fb; } },
  _set: function(k, v) { try { localStorage.setItem(this.NS + k, JSON.stringify(v)); } catch(_) {} },

  trackEvent: function(type, meta) {
    var event = {
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      type: type,
      device: this._detectDevice(),
      platform: this._detectPlatform(),
      ts: new Date().toISOString(),
      meta: meta || {}
    };
    var events = this._get('events', []);
    events.unshift(event);
    if (events.length > 200) events.length = 200;
    this._set('events', events);

    // Update counters
    var counters = this._get('counters', {});
    counters[type] = (counters[type] || 0) + 1;
    this._set('counters', counters);

    // Future: sync to Supabase
    if (SUPABASE_CONFIG.enabled) this._syncToSupabase(event);
    return event;
  },

  getEvents:   function() { return this._get('events', []); },
  getCounters: function() { return this._get('counters', {}); },
  getInstallCount: function() { return (this._get('counters', {}))['pwa_installed'] || 0; },
  getSessionCount: function() { return (this._get('counters', {}))['pwa_session_start'] || 0; },

  getDeviceBreakdown: function() {
    var events = this._get('events', []).filter(function(e) { return e.type === 'pwa_installed'; });
    var breakdown = {};
    events.forEach(function(e) { breakdown[e.device] = (breakdown[e.device] || 0) + 1; });
    return breakdown;
  },

  clearEvents: function() { this._set('events', []); this._set('counters', {}); },

  _detectDevice: function() {
    var ua = navigator.userAgent;
    if (/iPad|tablet/i.test(ua)) return 'Tablet';
    if (/iPhone|Android.*Mobile/i.test(ua)) return 'Mobile';
    return 'Desktop';
  },

  _detectPlatform: function() {
    var ua = navigator.userAgent;
    if (/iPhone|iPad/.test(ua)) return 'iOS';
    if (/Android/.test(ua)) return 'Android';
    if (/Windows/.test(ua)) return 'Windows';
    if (/Mac/.test(ua)) return 'macOS';
    return 'Other';
  },

  /* ── Supabase sync stub (wire up when ready) ── */
  _syncToSupabase: function(event) {
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) return;
    fetch(SUPABASE_CONFIG.url + '/rest/v1/pwa_events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_CONFIG.anonKey,
        'Authorization': 'Bearer ' + SUPABASE_CONFIG.anonKey
      },
      body: JSON.stringify({
        event_type: event.type,
        device: event.device,
        platform: event.platform,
        session_id: event.id,
        meta: event.meta
      })
    }).catch(function() {});
  },

  /* ── Supabase SQL (run once to set up) ── */
  SETUP_SQL: `
CREATE TABLE IF NOT EXISTS pwa_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  device text,
  platform text,
  session_id text,
  timestamp timestamptz DEFAULT now(),
  meta jsonb
);
CREATE INDEX ON pwa_events (event_type);
CREATE INDEX ON pwa_events (timestamp DESC);
  `
};

/* ── Auto-track session start ── */
if (typeof window !== 'undefined') {
  window.addEventListener('load', function() {
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) FP_PWA.trackEvent('pwa_session_start', { standalone: true });
  });

  window.addEventListener('appinstalled', function() {
    FP_PWA.trackEvent('pwa_installed', { source: 'browser_prompt' });
  });
}
