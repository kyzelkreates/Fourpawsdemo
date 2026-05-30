/*─────────────────────────────────────────────────────
  FOUR PAWS — AP3X AI Intelligence Layer
  Drives both Trainer OS analysis and Owner AI Coach.
─────────────────────────────────────────────────────*/

var AP3X_AI = {

  /* ── Owner portal: generate coaching response ── */
  coachResponse: function(dogName, userInput, progress) {
    var input = userInput.toLowerCase();
    var dog = dogName || 'your dog';

    var rules = [
      [/pull|lead|walk/,        function() { return dog + ' pulls because pulling works. Every time the lead goes tight, stop completely and wait. The instant it loosens — mark and move forward. Reward heavily at your hip. Consistency for 2–3 weeks produces a reliable loose lead.'; }],
      [/recall|come/,           function() { return 'Recall must be the best thing that ever happens to ' + dog + '. Every single time. Never call ' + dog + ' to anything unpleasant — go and get them instead. Jackpot reward (multiple treats one at a time) for every correct response.'; }],
      [/bite|mouth|nip/,        function() { return 'When ' + dog + ' bites hard: say "ouch!" once in a surprised tone, go still, remove attention for 15–30 seconds. Resume play. Never use force or punishment — it increases arousal and worsens the problem. Consistency wins this one.'; }],
      [/jump/,                  function() { return 'Four paws on the floor earns attention — jumping ends it immediately. No eye contact, no pushing, no words. The moment ' + dog + ' is on the floor, mark and reward. It feels slow at first, but it works reliably.'; }],
      [/bark/,                  function() { return 'Barking has many causes — I\'d want to understand the trigger first. Is ' + dog + ' barking at people, other dogs, sounds, or when left alone? Knowing the context means the solution can be targeted. Can you tell me more about when it happens?'; }],
      [/anxiety|scared|fear/,   function() { return 'Fear and anxiety in dogs are best addressed by working below threshold — creating positive associations at a distance the dog finds comfortable, then gradually reducing that distance over multiple sessions. Never force ' + dog + ' toward something they find scary.'; }],
      [/socialise|social/,      function() { return 'Socialisation quality beats quantity every time. One calm, positive interaction at ' + dog + '\'s pace teaches more than ten chaotic ones. Let ' + dog + ' approach — never push them toward other dogs or people.'; }],
      [/not listen|ignor/,      function() { return 'If ' + dog + ' is ignoring cues they know, it\'s almost always a threshold or motivation issue — either too distracted, or the reward isn\'t valuable enough for the difficulty level. Increase distance from distractions and upgrade to higher-value rewards.'; }]
    ];

    for (var i = 0; i < rules.length; i++) {
      if (rules[i][0].test(input)) return rules[i][1]();
    }

    // Context-aware default
    if (progress && progress.pct >= 80) {
      return 'You\'re in the final stretch — ' + progress.pct + '% complete. At this stage, focus on real-world proofing. Take the skills ' + dog + ' has and practise them in progressively more challenging environments. The foundations are solid.';
    }
    return 'Based on where ' + dog + ' is in the programme, I\'d recommend short, consistent sessions (5–10 minutes) rather than longer irregular ones. Dogs learn through repetition — daily practice at a low intensity outperforms weekly sessions every time. What specific behaviour are you working on?';
  },

  /* ── Trainer OS: analyse a dog and return structured insight ── */
  analysedog: function(dog, sessions) {
    var recentSessions = (sessions || []).filter(function(s) { return s.dog === dog.name; }).slice(0, 5);
    var avgConf = recentSessions.length ? (recentSessions.reduce(function(s, x) { return s + x.confidence; }, 0) / recentSessions.length) : 0;
    var concerns = recentSessions.map(function(s) { return s.concern; }).filter(function(c) { return c && c !== 'None'; });
    var repeatConcern = concerns.length >= 2 && concerns[0] === concerns[1];

    return {
      riskLevel: dog.lastSeen > 10 ? 'high' : avgConf < 2.5 ? 'high' : repeatConcern ? 'warn' : 'ok',
      recommendation: this._trainerRec(dog, avgConf, repeatConcern),
      engagementRisk: dog.lastSeen > 7,
      completionRisk: dog.lessonsComplete < 5 && dog.sessions > 8
    };
  },

  _trainerRec: function(dog, avgConf, repeatConcern) {
    if (dog.lastSeen > 10) return 'OUTREACH NEEDED: ' + dog.owner + ' has been inactive for ' + dog.lastSeen + ' days. Send a personalised re-engagement message with a simple 5-minute homework task.';
    if (avgConf < 2.5) return 'LOW CONFIDENCE PATTERN: Average session confidence is below 2.5/5. Consider scheduling a check-in call to review technique and simplify the current training focus.';
    if (repeatConcern) return 'REPEAT CONCERN: ' + dog.name + ' has flagged the same issue in multiple sessions. Provide targeted owner guidance for this specific behaviour before the next session.';
    if (dog.lessonsComplete >= 14) return 'COMPLETION READY: ' + dog.name + ' is near the end of the programme. Prepare certificate and begin next-steps conversation.';
    return 'ON TRACK: Continue current plan. Monitor for engagement dips.';
  },

  /* ── Platform-wide summary for trainer dashboard ── */
  platformSummary: function(dogs, sessions) {
    var inactive = dogs.filter(function(d) { return d.lastSeen > 7; });
    var highRisk  = dogs.filter(function(d) { return d.flag === 'high'; });
    var nearComp  = dogs.filter(function(d) { return d.lessonsComplete >= 14; });
    var avgConf   = sessions.length ? (sessions.reduce(function(s, x) { return s + x.confidence; }, 0) / sessions.length).toFixed(1) : '—';

    return {
      inactiveOwners:  inactive.length,
      highRiskDogs:    highRisk.length,
      nearCompletion:  nearComp.length,
      avgConfidence:   avgConf,
      topPriority:     inactive[0] || highRisk[0] || null
    };
  }
};
