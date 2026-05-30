/*─────────────────────────────────────────────────────────────
  FOUR PAWS TRAINING & ENRICHMENT ACADEMY
  Powered by AP3X Intelligent AI
  storage.js — Single source of truth for all data
  Swap _store for Supabase adapter without changing anything else.
─────────────────────────────────────────────────────────────*/

/* ── 5-MODULE PUPPY MASTERCLASS CURRICULUM ── */
const FP_COURSE = {
  id: 'puppy-masterclass',
  name: 'Puppy Masterclass',
  modules: [
    {
      id: 'm1', n: 1, emoji: '🌱',
      name: 'Foundations',
      desc: 'Building trust, focus and the communication framework your dog needs for everything that follows.',
      lessons: [
        {
          id:'m1_l1', name:'Trust & Bonding',
          desc:'Establishing a safe, predictable relationship through calm handling and consistent reward.',
          content:`<h3>Why Trust Comes First</h3>
<p>Before your dog can learn anything, they need to feel safe with you. Trust is built through predictability — your dog should be able to anticipate that calm behaviour leads to good things, and that you will never use fear or force.</p>
<h4>Key Concepts</h4>
<ul><li><strong>Predictability:</strong> Respond the same way every time. Dogs learn through pattern recognition.</li><li><strong>Safe Space:</strong> Give your dog a place that is always theirs — a crate or mat where they are never disturbed.</li><li><strong>Body Language:</strong> Crouch low, avoid direct eye contact initially, let your dog approach you.</li></ul>
<h4>This Week's Homework</h4>
<p>Spend 5 minutes twice daily simply being in the same space as your dog — no training, no commands. Let them choose to engage with you. Mark and reward any voluntary approach.</p>
<div class="lesson-quiz" data-lesson="m1_l1"><h4>Knowledge Check</h4><p>What is the MOST important element of building trust with a new dog?</p><div class="quiz-options"><button class="qo" data-correct="false">Using a firm tone so they know you're in charge</button><button class="qo" data-correct="true">Consistent, predictable responses that the dog can rely on</button><button class="qo" data-correct="false">Keeping them in their crate to prevent bad habits</button></div></div>`,
          tip:'Every gentle, predictable interaction builds trust — the foundation of all training.', xp:50
        },
        {
          id:'m1_l2', name:'Name Recognition',
          desc:'Teaching your dog their name means "look at me" — the gateway to all communication.',
          content:`<h3>Your Dog's Most Important Cue</h3>
<p>Their name is not a command — it's an attention signal. It means "something good is about to happen, look at me." Every time you say it and they respond, you must deliver.</p>
<h4>Teaching Name Recognition</h4>
<ol><li>Say your dog's name once, clearly and warmly.</li><li>The instant they look at you — even a flicker — mark it with "yes!" and deliver a treat.</li><li>Practise 10 repetitions in a low-distraction environment first.</li><li>Gradually increase distraction as reliability improves.</li></ol>
<h4>Critical Rules</h4>
<ul><li>Never repeat the name to get attention — say it once only.</li><li>Never use the name in a negative context (calling them for something unpleasant).</li><li>If they don't respond, move closer or reduce distraction — don't repeat.</li></ul>
<div class="lesson-quiz" data-lesson="m1_l2"><h4>Knowledge Check</h4><p>If your dog doesn't respond when you say their name, what should you do?</p><div class="quiz-options"><button class="qo" data-correct="false">Repeat their name louder until they respond</button><button class="qo" data-correct="false">Say their name three times quickly</button><button class="qo" data-correct="true">Move closer or reduce distraction, then try once more</button></div></div>`,
          tip:'Say the name once, reward the eye contact. Never repeat it to get attention.', xp:50
        },
        {
          id:'m1_l3', name:'Marker Training',
          desc:'Introducing a consistent yes-marker to pinpoint the exact moment of success.',
          content:`<h3>The Power of Precise Communication</h3>
<p>A marker word (or clicker) is a bridge signal — it tells your dog the exact moment they did the right thing. Without it, your dog has to guess what earned the reward. With it, learning accelerates dramatically.</p>
<h4>Setting Up Your Marker</h4>
<ol><li>Choose your marker word: "Yes!" works well. Keep it short and distinctive.</li><li>Charge the marker: Say "yes!" then immediately deliver a treat 30 times in a row with no behaviour required. You're building the association.</li><li>Test it: Drop a treat on the floor. When your dog looks up after eating it, say "yes!" before delivering the next treat. Watch for brightening — they're learning.</li></ol>
<h4>Rules of Marker Training</h4>
<ul><li>The marker ALWAYS predicts a reward. No exceptions.</li><li>Mark at the peak of the behaviour, not after.</li><li>One mark = one reward. Always follow through.</li></ul>
<div class="lesson-quiz" data-lesson="m1_l3"><h4>Knowledge Check</h4><p>What does "charging the marker" mean?</p><div class="quiz-options"><button class="qo" data-correct="false">Teaching the dog to sit when they hear the word</button><button class="qo" data-correct="true">Building the association between the marker word and a reward, with no behaviour required</button><button class="qo" data-correct="false">Using the marker word as a command to stay still</button></div></div>`,
          tip:'Your marker must always be followed by a reward — no exceptions, ever.', xp:60
        }
      ]
    },
    {
      id: 'm2', n: 2, emoji: '📡',
      name: 'Communication',
      desc: 'Developing a clear two-way communication system your dog understands in any environment.',
      lessons: [
        {
          id:'m2_l1', name:'Cue Introduction',
          desc:'Teaching verbal and hand signal cues that your dog responds to reliably.',
          content:`<h3>Building a Cue Library</h3>
<p>A cue tells your dog a specific behaviour will earn reward. The cue itself means nothing until you've paired it with a behaviour hundreds of times. Start with behaviours, add the cue only when reliable.</p>
<h4>Cue Introduction Process</h4>
<ol><li><strong>Lure the behaviour</strong> — get the action happening without any cue word.</li><li><strong>Mark and reward</strong> — 10–20 successful repetitions.</li><li><strong>Add the cue</strong> — say the word just before the action begins.</li><li><strong>Proof the cue</strong> — gradually fade the lure, increase distraction.</li></ol>
<h4>Essential Early Cues</h4>
<ul><li><strong>Sit</strong> — most dogs offer this naturally. Capture and name it.</li><li><strong>Down</strong> — lure nose to chest, then to floor.</li><li><strong>Watch me</strong> — voluntary eye contact on cue.</li></ul>
<div class="lesson-quiz" data-lesson="m2_l1"><h4>Knowledge Check</h4><p>When should you introduce the verbal cue for a new behaviour?</p><div class="quiz-options"><button class="qo" data-correct="false">Before the dog knows how to do the behaviour at all</button><button class="qo" data-correct="true">Once the dog is reliably performing the behaviour without prompting</button><button class="qo" data-correct="false">Only when using treats, never with toys</button></div></div>`,
          tip:'A cue only works if the behaviour is already reliable — name what the dog already does.', xp:60
        },
        {
          id:'m2_l2', name:'Recall Foundations',
          desc:'Teaching "come" as the most rewarding thing in your dog\'s world.',
          content:`<h3>Recall — Your Most Important Safety Skill</h3>
<p>A reliable recall could save your dog's life. It must be the most consistently rewarded behaviour in your arsenal — every single time, without exception.</p>
<h4>Building a Bulletproof Recall</h4>
<ol><li>Start on a long line (5–10 metres) in low distraction.</li><li>Let your dog move away. Call "come!" in a bright, happy voice — once only.</li><li>When they reach you: jackpot reward (5–10 small treats delivered one at a time), big praise, play if they enjoy it.</li><li>Never repeat "come" if ignored — move away from them instead, make yourself exciting.</li></ol>
<h4>Recall Rules — Never Break These</h4>
<ul><li>Never call your dog to anything unpleasant (bath, nail trim, end of play).</li><li>If you need to do something your dog dislikes — go and get them instead.</li><li>Recall to you = best thing that ever happens. Always.</li></ul>
<div class="lesson-quiz" data-lesson="m2_l2"><h4>Knowledge Check</h4><p>Your dog won't come when called. What should you do first?</p><div class="quiz-options"><button class="qo" data-correct="false">Repeat "come" in a firmer voice until they respond</button><button class="qo" data-correct="true">Move away from the dog to make yourself more interesting, then try again</button><button class="qo" data-correct="false">Put them on lead immediately as punishment</button></div></div>`,
          tip:'Never call your dog to anything unpleasant. Protect that recall cue with your life.', xp:80
        },
        {
          id:'m2_l3', name:'Reading Your Dog',
          desc:'Understanding body language, stress signals and when to stop a session.',
          content:`<h3>Dogs Communicate Constantly — Learn Their Language</h3>
<p>Your dog gives you feedback in every session. Learning to read it means you'll train more effectively, avoid pushing past threshold, and build a stronger relationship.</p>
<h4>Stress & Discomfort Signals</h4>
<ul><li><strong>Yawning</strong> (out of context) — mild stress or discomfort.</li><li><strong>Lip licking</strong> — anxiety or low-level stress.</li><li><strong>Looking away / sniffing suddenly</strong> — displacement behaviour, needs a break.</li><li><strong>Whale eye / showing whites of eyes</strong> — uncomfortable, back off.</li><li><strong>Stiff body, slow movement</strong> — over-threshold, end the session.</li></ul>
<h4>Green Light Signals</h4>
<ul><li>Loose, wiggly body</li><li>Voluntarily re-engaging after reward</li><li>Soft eyes, relaxed ears</li><li>Offering behaviours without being asked</li></ul>
<h4>When to Stop</h4>
<p>Always end on success, but keep sessions short (3–5 mins for puppies). Stop before your dog mentally checks out — you'll see it in their body language first.</p>
<div class="lesson-quiz" data-lesson="m2_l3"><h4>Knowledge Check</h4><p>Your dog starts yawning and sniffing the ground during a training session. What does this most likely indicate?</p><div class="quiz-options"><button class="qo" data-correct="false">They are bored and need harder tasks</button><button class="qo" data-correct="true">They are showing mild stress or displacement behaviour and need a break</button><button class="qo" data-correct="false">They are very relaxed and the session is going perfectly</button></div></div>`,
          tip:'When your dog sniffs suddenly during training, they\'re telling you something. Listen.', xp:70
        }
      ]
    },
    {
      id: 'm3', n: 3, emoji: '🧠',
      name: 'Behaviour Development',
      desc: 'Building impulse control, bite inhibition and the calm foundation for lifelong good behaviour.',
      lessons: [
        {
          id:'m3_l1', name:'Impulse Control',
          desc:'Building the ability to pause before reacting — the most transferable skill in dog training.',
          content:`<h3>The Dog Who Can Wait Can Cope With Anything</h3>
<p>Impulse control is the foundation of every advanced behaviour. A dog that can pause, wait, and think before acting is a dog that can handle the real world.</p>
<h4>Core Impulse Control Exercises</h4>
<p><strong>Leave It (Foundation):</strong></p>
<ol><li>Hold a treat in a closed fist. Present it to your dog.</li><li>Wait. They will sniff, paw, lick. Do not open your hand.</li><li>The instant they move away or look at you — mark and reward with the OTHER hand.</li><li>Build duration. The dog learns: disengaging from temptation = reward.</li></ol>
<p><strong>Wait at Doorways:</strong></p>
<ol><li>Approach a doorway. Ask for sit or pause.</li><li>Reach for the handle. If your dog moves — calmly reset them.</li><li>Open the door only when all four paws are still. Mark and release with "free."</li></ol>
<div class="lesson-quiz" data-lesson="m3_l1"><h4>Knowledge Check</h4><p>When teaching "leave it," when should you reward the dog?</p><div class="quiz-options"><button class="qo" data-correct="false">When they finally get the treat from your hand</button><button class="qo" data-correct="true">The moment they move away from your closed fist or offer eye contact</button><button class="qo" data-correct="false">After they have ignored the treat for a full minute</button></div></div>`,
          tip:'Impulse control transfers everywhere — a dog who can wait is a dog who can cope.', xp:80
        },
        {
          id:'m3_l2', name:'Bite Inhibition',
          desc:'Teaching your puppy to control jaw pressure — a critical safety skill for life.',
          content:`<h3>Why Bite Inhibition Is Non-Negotiable</h3>
<p>All dogs can bite. Bite inhibition is your dog's ability to control the pressure of their mouth — it's what determines whether a bite causes damage or not. This must be taught before 16 weeks if possible.</p>
<h4>Teaching Bite Inhibition</h4>
<p><strong>Stage 1 — Hard Bites Only:</strong></p>
<ul><li>Allow gentle mouthing in play.</li><li>When a hard bite occurs: immediately say "ouch!" in a surprised tone, go still, remove attention for 10–30 seconds.</li><li>Resume play. Repeat consistently.</li></ul>
<p><strong>Stage 2 — Any Tooth Pressure:</strong></p>
<ul><li>Once hard biting stops, begin marking any tooth-on-skin contact.</li><li>Consistently withdraw attention for any mouthing.</li></ul>
<h4>What Not To Do</h4>
<ul><li>Never punish, tap the nose, or use force — this increases arousal and risk.</li><li>Never pull your hand away fast — this triggers chase instinct.</li></ul>
<div class="lesson-quiz" data-lesson="m3_l2"><h4>Knowledge Check</h4><p>Your puppy bites hard during play. What is the correct first response?</p><div class="quiz-options"><button class="qo" data-correct="false">Firmly tap their nose to show dominance</button><button class="qo" data-correct="true">Say "ouch!", go still, and withdraw attention for 10–30 seconds</button><button class="qo" data-correct="false">Immediately end the session and put them in their crate</button></div></div>`,
          tip:'A yelp and pause teaches more than any punishment — consistency is everything.', xp:80
        },
        {
          id:'m3_l3', name:'Socialisation',
          desc:'Structured, positive introductions to build confidence in any environment.',
          content:`<h3>The Socialisation Window</h3>
<p>Puppies have a critical socialisation window (3–14 weeks) where experiences shape their future responses. But socialisation doesn't end there — every positive experience in the first year matters.</p>
<h4>Socialisation Is Not Just Exposure</h4>
<p>Flooding a puppy with stimuli is NOT socialisation — it's overwhelming. True socialisation means: <strong>positive emotional associations</strong> built through controlled, rewarded exposure.</p>
<h4>Socialisation Checklist</h4>
<ul><li>Different people (age, gender, appearance, uniform)</li><li>Other dogs (calm, vaccinated, well-matched)</li><li>Environments (urban, rural, indoors, transport)</li><li>Sounds (traffic, children, household appliances)</li><li>Surfaces (grass, gravel, metal, water)</li><li>Handling (paws, ears, mouth, vet positions)</li></ul>
<h4>The Rule</h4>
<p>One calm positive interaction beats twenty chaotic ones. Quality over quantity, always.</p>
<div class="lesson-quiz" data-lesson="m3_l3"><h4>Knowledge Check</h4><p>What is the correct approach to socialising a puppy with a new environment?</p><div class="quiz-options"><button class="qo" data-correct="false">Expose them to as many things as possible in one session</button><button class="qo" data-correct="false">Wait until they are fully vaccinated before any exposure</button><button class="qo" data-correct="true">Controlled, rewarded introductions at the puppy's own pace</button></div></div>`,
          tip:'One calm, positive interaction beats twenty chaotic ones.', xp:80
        }
      ]
    },
    {
      id: 'm4', n: 4, emoji: '🌍',
      name: 'Real World Training',
      desc: 'Taking skills from the living room into the real world — streets, parks and public spaces.',
      lessons: [
        {
          id:'m4_l1', name:'Loose Lead Walking',
          desc:'Teaching your dog that a tight lead stops the walk — and a loose lead continues it.',
          content:`<h3>Walking on Lead — The Most Common Challenge</h3>
<p>Dogs pull because pulling works — it gets them where they want to go. The solution is simple: pulling never works. A tight lead stops forward movement. A loose lead = walk continues.</p>
<h4>The Foundation Method</h4>
<ol><li>Stand still the instant the lead goes tight. Do nothing. Wait.</li><li>When your dog looks back or the lead loosens: mark immediately and move forward.</li><li>Reward heavily at your hip — this teaches them where to walk.</li><li>Be a tree for the first two weeks. Consistency is the entire training plan.</li></ol>
<h4>Building Duration</h4>
<ul><li>Start in low distraction — your garden or a quiet street.</li><li>Reward every 5–10 steps initially. Gradually extend the gap.</li><li>When encountering distractions: stop, wait for check-in, mark and proceed.</li></ul>
<div class="lesson-quiz" data-lesson="m4_l1"><h4>Knowledge Check</h4><p>Your dog pulls ahead. What is the correct response?</p><div class="quiz-options"><button class="qo" data-correct="false">Give a sharp correction on the lead to get their attention</button><button class="qo" data-correct="true">Stop completely and wait for the lead to loosen before moving again</button><button class="qo" data-correct="false">Speed up to keep pace with your dog</button></div></div>`,
          tip:'Reward at your hip, not out in front. Movement is the reward — use it.', xp:80
        },
        {
          id:'m4_l2', name:'Distraction Proofing',
          desc:'Maintaining focus and behaviour compliance when the environment gets interesting.',
          content:`<h3>From Controlled to Chaotic</h3>
<p>A behaviour your dog only does at home isn't trained — it's practised. Distraction proofing is the process of gradually raising the difficulty until your dog can respond anywhere.</p>
<h4>The Distraction Ladder</h4>
<p>Work through these levels, spending time at each before moving on:</p>
<ol><li>Home — no distractions</li><li>Garden — mild environmental distractions</li><li>Quiet street — light movement and sound</li><li>Park — distant dogs and people</li><li>Busy area — close distractions, high arousal</li></ol>
<h4>The Golden Rule</h4>
<p>Always work below threshold. If your dog cannot respond, you're one step too difficult. Drop back, rebuild confidence, try again.</p>
<h4>When It Goes Wrong</h4>
<ul><li>Your dog lunges, barks, or completely ignores you? You've exceeded threshold.</li><li>Increase distance from the distraction, reward for any check-in, end on success.</li></ul>
<div class="lesson-quiz" data-lesson="m4_l2"><h4>Knowledge Check</h4><p>Your dog cannot perform a reliable sit near other dogs in the park. What should you do?</p><div class="quiz-options"><button class="qo" data-correct="false">Repeat the cue louder and use a firmer lead correction</button><button class="qo" data-correct="true">Increase distance from the distraction and rebuild from a level where success is possible</button><button class="qo" data-correct="false">Stop training this behaviour until they are older</button></div></div>`,
          tip:'Work below threshold always. If your dog can\'t respond, you\'re too close.', xp:80
        },
        {
          id:'m4_l3', name:'Public Spaces',
          desc:'Settle cues, café training and navigating busy environments with confidence.',
          content:`<h3>Life Beyond the Training Session</h3>
<p>The goal of all training is a dog who can accompany you through life — cafés, markets, waiting rooms, family visits. The settle behaviour makes this possible.</p>
<h4>Teaching the Settle</h4>
<ol><li>Take your dog to a slightly boring public space with a mat or their bed.</li><li>Ask for a down. Mark and reward for staying down.</li><li>Gradually build duration — 1 minute, then 5, then 20.</li><li>Introduce mild activity around them while they remain on the mat.</li><li>A lick mat or chew is your best tool here — a busy mouth is a calm dog.</li></ol>
<h4>Café Training Steps</h4>
<ol><li>Walk past the café (no entry).</li><li>Sit outside for 5 minutes — reward calmness.</li><li>Enter and immediately find a spot — down on mat.</li><li>Keep the first visit very short and very rewarding.</li><li>Build up duration over multiple visits.</li></ol>
<div class="lesson-quiz" data-lesson="m4_l3"><h4>Knowledge Check</h4><p>What is the most effective tool for keeping a dog calm in a café or public space?</p><div class="quiz-options"><button class="qo" data-correct="false">Keeping the lead very short and taut so they cannot move</button><button class="qo" data-correct="true">A lick mat or appropriate chew that gives them a calm, sustained activity</button><button class="qo" data-correct="false">Bringing their favourite toy to play with</button></div></div>`,
          tip:'Bring a lick mat. A busy mouth is a calm dog.', xp:80
        }
      ]
    },
    {
      id: 'm5', n: 5, emoji: '🏆',
      name: 'Long-Term Success',
      desc: 'Building habits, maintaining skills and setting your dog up for a lifetime of good behaviour.',
      lessons: [
        {
          id:'m5_l1', name:'Variable Reinforcement',
          desc:'Transitioning from constant rewards to real-world reward patterns that maintain strong behaviours.',
          content:`<h3>Why Variable Rewards Work Better Long-Term</h3>
<p>You've built reliable behaviours through consistent reward. Now it's time to transition to variable reinforcement — the same principle that makes slot machines compelling. Unpredictable rewards maintain and even strengthen trained behaviours.</p>
<h4>How to Transition</h4>
<ol><li>Behaviour is solid (9/10 correct in multiple environments).</li><li>Begin rewarding every other response. Then every third. Then randomly.</li><li>Always reward for exceptional responses — fast, first-ask, high-distraction.</li><li>Maintain occasional jackpots for outstanding performances.</li></ol>
<h4>What Not To Do</h4>
<ul><li>Don't reduce rewards too fast — you'll lose the behaviour.</li><li>Don't stop rewarding entirely — even after years, the occasional treat maintains strength.</li><li>Never punish for a slow response after removing rewards.</li></ul>
<div class="lesson-quiz" data-lesson="m5_l1"><h4>Knowledge Check</h4><p>When should you begin transitioning to variable reinforcement?</p><div class="quiz-options"><button class="qo" data-correct="false">From the very first training session</button><button class="qo" data-correct="false">After just 3–4 correct responses</button><button class="qo" data-correct="true">Once the behaviour is solid — reliably correct in multiple environments</button></div></div>`,
          tip:'Vary reward timing once a behaviour is solid. Unpredictability keeps dogs sharp.', xp:90
        },
        {
          id:'m5_l2', name:'Enrichment Planning',
          desc:'Building a sustainable weekly plan for mental stimulation, confidence and wellbeing.',
          content:`<h3>Mental Stimulation Is Not Optional</h3>
<p>A tired dog is a good dog — but a mentally tired dog is even better. Physical exercise alone is not enough. Enrichment meets your dog's need to sniff, explore, solve and play.</p>
<h4>The Four Pillars of Enrichment</h4>
<ul><li><strong>Scent work:</strong> Hide food around the garden, use a snuffle mat, scatter feed in grass.</li><li><strong>Problem solving:</strong> Puzzle feeders, Kongs, slow feeders, cardboard box destruction.</li><li><strong>Social play:</strong> Appropriate dog-dog play, structured play with you (tug, fetch, chase).</li><li><strong>Confidence:</strong> Novel surfaces, heights, environments — at your dog's pace.</li></ul>
<h4>Weekly Enrichment Template</h4>
<p>Aim for: one scent activity, one puzzle, one confidence challenge every 48 hours. This replaces a significant proportion of the frustration and stress behaviours trainers see.</p>
<div class="lesson-quiz" data-lesson="m5_l2"><h4>Knowledge Check</h4><p>What is the primary purpose of a snuffle mat or scatter feeding?</p><div class="quiz-options"><button class="qo" data-correct="false">To slow down fast eaters for digestive health only</button><button class="qo" data-correct="true">To provide mental stimulation through natural foraging behaviour</button><button class="qo" data-correct="false">To teach dogs to eat more politely</button></div></div>`,
          tip:'Aim for one scent, one puzzle, one confidence challenge every 48 hours.', xp:80
        },
        {
          id:'m5_l3', name:'Training for Life',
          desc:'Maintaining skills, preventing regression and continuing to develop your dog throughout their life.',
          content:`<h3>Training Never Stops — It Just Changes</h3>
<p>Completing this course is the beginning, not the end. Dogs who stop being trained gradually lose reliability. Dogs who continue to learn remain engaged, confident and well-behaved for life.</p>
<h4>Maintenance Training</h4>
<ul><li>5 minutes of training 3–4 times per week is enough to maintain all core skills.</li><li>Use meals as training opportunities — every piece of food can earn a behaviour.</li><li>Introduce new skills periodically to keep your dog mentally engaged.</li></ul>
<h4>Preventing Regression</h4>
<ul><li>Watch for early signs: slower response times, increased testing, selective hearing.</li><li>When regression appears — go back one step, rebuild, don't push through.</li><li>Life events (moving home, new baby, illness) often cause temporary regression. It's normal.</li></ul>
<h4>Your Next Steps</h4>
<ul><li>Advanced recall and off-lead work</li><li>Tricks and sport foundation (scent work, agility, heelwork)</li><li>Canine Good Citizen assessment</li><li>Community integration and therapy dog pathways</li></ul>
<div class="lesson-quiz" data-lesson="m5_l3"><h4>Knowledge Check</h4><p>Your dog begins responding more slowly to cues they previously knew well. What does this indicate?</p><div class="quiz-options"><button class="qo" data-correct="false">They have forgotten the behaviour and need to be retrained from scratch</button><button class="qo" data-correct="true">Early regression — go back one step, rebuild reliability, don't push through</button><button class="qo" data-correct="false">They are bored and the behaviour should be retired</button></div></div>`,
          tip:'A dog who keeps learning keeps thriving. Training never truly ends.', xp:100
        }
      ]
    }
  ]
};

/* ─────────────────────────────────────────────────────────────
   STORAGE ADAPTER
   Replace _store with Supabase adapter for cloud sync.
─────────────────────────────────────────────────────────────*/
const _store = {
  NS: 'fp3_',
  get(key, fallback) {
    try { const v = localStorage.getItem(this.NS + key); return v !== null ? JSON.parse(v) : fallback; } catch (_) { return fallback; }
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
  }
};

/* ─────────────────────────────────────────────────────────────
   FP_STORE — Public API
─────────────────────────────────────────────────────────────*/
const FP_STORE = {
  // ── Course ──
  getModules:       ()    => FP_COURSE.modules,
  getModule:        (id)  => FP_COURSE.modules.find(m => m.id === id) || null,
  getAllLessons:     ()    => FP_COURSE.modules.flatMap(m => m.lessons),
  getLesson:        (id)  => FP_COURSE.modules.flatMap(m => m.lessons).find(l => l.id === id) || null,
  getCourseName:    ()    => FP_COURSE.name,

  // ── Owner profile ──
  getOwnerProfile:  ()    => _store.get('owner_profile', null),
  setOwnerProfile:  (p)   => _store.set('owner_profile', p),
  getDogProfile:    ()    => _store.get('dog_profile', null),
  setDogProfile:    (p)   => _store.set('dog_profile', p),

  // ── Lesson completions ──
  getCompletedLessons: () => _store.get('completed_lessons', []),
  setCompletedLessons: (a) => _store.set('completed_lessons', a),
  markLessonDone: (id) => {
    const list = _store.get('completed_lessons', []);
    if (!list.includes(id)) { list.push(id); _store.set('completed_lessons', list); }
  },
  markLessonUndone: (id) => {
    _store.set('completed_lessons', _store.get('completed_lessons', []).filter(x => x !== id));
  },
  isLessonDone: (id)  => _store.get('completed_lessons', []).includes(id),
  isModuleDone: (mid) => {
    const mod = FP_COURSE.modules.find(m => m.id === mid);
    if (!mod) return false;
    const done = _store.get('completed_lessons', []);
    return mod.lessons.every(l => done.includes(l.id));
  },
  getProgress: () => {
    const done  = _store.get('completed_lessons', []);
    const total = FP_COURSE.modules.flatMap(m => m.lessons).length;
    return { done: done.length, total, pct: total ? Math.round(done.length / total * 100) : 0 };
  },
  getCurrentModule: () => {
    const done = _store.get('completed_lessons', []);
    return FP_COURSE.modules.find(m => !m.lessons.every(l => done.includes(l.id))) || FP_COURSE.modules[FP_COURSE.modules.length - 1];
  },
  getNextLesson: () => {
    const done = _store.get('completed_lessons', []);
    const cur  = FP_COURSE.modules.find(m => !m.lessons.every(l => done.includes(l.id)));
    return cur ? cur.lessons.find(l => !done.includes(l.id)) || null : null;
  },
  getTotalXP: () => {
    const done = _store.get('completed_lessons', []);
    return FP_COURSE.modules.flatMap(m => m.lessons)
      .filter(l => done.includes(l.id))
      .reduce((s, l) => s + (l.xp || 0), 0);
  },

  // ── Session logs ──
  getSessions:    ()        => _store.get('sessions', []),
  addSession:     (s)       => _store.append('sessions', { ...s, id: Date.now(), ts: new Date().toISOString() }, 100),

  // ── AI data (flows to trainer) ──
  getAIData:      ()        => _store.get('ai_data', {}),
  setAIData:      (d)       => _store.set('ai_data', d),
  updateAIData:   (patch)   => _store.set('ai_data', { ..._store.get('ai_data', {}), ...patch }),

  // ── Sync payload (owner → trainer) ──
  getSyncPayload: () => {
    const dog     = _store.get('dog_profile', {});
    const owner   = _store.get('owner_profile', {});
    const done    = _store.get('completed_lessons', []);
    const ai      = _store.get('ai_data', {});
    const sessions = _store.get('sessions', []);
    const total   = FP_COURSE.modules.flatMap(m => m.lessons).length;
    return {
      owner, dog,
      progress: { done: done.length, total, pct: total ? Math.round(done.length / total * 100) : 0 },
      completedLessons: done,
      aiData: ai,
      recentSessions: sessions.slice(0, 5),
      syncedAt: new Date().toISOString()
    };
  },

  // ── Homework ──
  getHomework:    ()        => _store.get('homework', []),
  addHomework:    (h)       => _store.append('homework', { ...h, id: Date.now(), ts: new Date().toISOString() }, 50),

  // ── Journal ──
  getJournal:     ()        => _store.get('journal', []),
  addJournal:     (e)       => _store.append('journal', { ...e, id: Date.now(), ts: new Date().toISOString() }, 100),

  // ── Reset (dev only) ──
  reset: () => {
    ['completed_lessons','sessions','ai_data','owner_profile','dog_profile','homework','journal'].forEach(k => _store.remove(k));
  }
};
