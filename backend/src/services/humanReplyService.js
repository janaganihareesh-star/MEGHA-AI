/**
 * humanReplyService.js
 * Generates contextual quick-reply suggestions based on user's message and detected mood.
 * Layer 12 (Time Engine) + Layer 4 (Emotion Engine) informed suggestions.
 */

// ─────────────────────────────────────────────────────────────────────────────
// REPLY POOL — mood + context based
// ─────────────────────────────────────────────────────────────────────────────
const REPLY_POOLS = {
  sad: [
    'Em jarigindi? Cheppu ra...',
    'Aaa... nenu vinnanu. Continue cheppu.',
    'Idi really tough ga undi. Nuvvu alone kaadhu.'
  ],
  lonely: [
    'Nenu ikkade unna. Cheppu em jarigindi.',
    'Ontariga feel avvaku ra — matladudham.',
    'Miss chesav? Ela jarigindi?'
  ],
  anxious: [
    'Parledu ra, nidhana ga cheppu.',
    'Deep breath teesuko. Emi worry avutunnav?',
    'Okasaari cheppu — exact em tension?'
  ],
  angry: [
    'Cheppu ra — em jarigindi exactly?',
    'Sare, vinnanu. Continue cheyyi.',
    'Kopam valid ga undi. Cheppu inka.'
  ],
  tired: [
    'Rest teesuko ra. Tarvata matladudham.',
    'Aaa... exhausted ga undi kabatti. Thoda rest?',
    'Niluvunaleduu feel avutundaa? Normal ra idi.'
  ],
  happy: [
    'Wah! Cheppu cheppu — em ayyindi?! 😊',
    'Nenu kuda happy ga feel avutunna! Share cheyyi!',
    'Yayyy! Idi vinali undi. Inka details?'
  ],
  excited: [
    'Ohh!! Cheppu ra! 🎉',
    'Idi nijamgaa amazing! Em ayyindi exactly?',
    'Excited ga undi! Tell me everything!'
  ],
  food: [
    'Tinnanu ra, nuvvu tinnava? 🍲',
    'Em special eeroju?',
    'Saraga tinaali ra — important!'
  ],
  exam: [
    'All the best! Baga prepare avvu 💪',
    'Kangaaru padaku, focus cheyyi.',
    'Mock start cheddama — help cheyyanaa?'
  ],
  coding: [
    'Cheppu ra — exact error em?',
    'Code share cheyyi, fix chestanu.',
    'Sare, idi together solve cheyyochu!'
  ],
  morning: [
    'Good morning! Eeroju em plans? ☀️',
    'Fresh start ra — what\'s the goal today?',
    'Morning! Breakfast chesava?'
  ],
  night: [
    'Late ayyindi ra... rest teesuko 🌙',
    'Oka last thought cheppi sleep cheyyi.',
    'Eeroju ela ayyindi — summarize cheyyistaav?'
  ],
  general: [
    'Cheppu ra, inka em sangathulu?',
    'Nenu vinnanu — continue cheyyi.',
    'Hmm... sare, ela proceed cheyyadam?'
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function generateHumanReply(userMessage, context = {}) {
  if (!userMessage) {
    return ['Ela unnav?', 'Em cheppali?', 'Nenu vinnanu ra.'];
  }

  const { mood, energyLevel, currentHour } = context;
  const text = userMessage.toLowerCase();

  // Time-based replies (Layer 12)
  if (currentHour !== undefined) {
    if (currentHour >= 5 && currentHour < 11) {
      return _pickRandom(REPLY_POOLS.morning);
    }
    if (currentHour >= 22 || currentHour < 4) {
      return _pickRandom(REPLY_POOLS.night);
    }
  }

  // Mood-based replies (Layer 4)
  if (mood && REPLY_POOLS[mood]) {
    return _pickRandom(REPLY_POOLS[mood]);
  }

  // Content-based detection
  if (text.includes('food') || text.includes('tinna') || text.includes('lunch') ||
      text.includes('dinner') || text.includes('breakfast') || text.includes('tinte')) {
    return _pickRandom(REPLY_POOLS.food);
  }

  if (text.includes('exam') || text.includes('interview') || text.includes('test') ||
      text.includes('study') || text.includes('results') || text.includes('marks')) {
    return _pickRandom(REPLY_POOLS.exam);
  }

  if (text.includes('code') || text.includes('error') || text.includes('bug') ||
      text.includes('function') || text.includes('debug') || text.includes('react') ||
      text.includes('python') || text.includes('java')) {
    return _pickRandom(REPLY_POOLS.coding);
  }

  if (text.includes('sad') || text.includes('crying') || text.includes('alone') ||
      text.includes('baadha') || text.includes('chachipoyali')) {
    return _pickRandom(REPLY_POOLS.sad);
  }

  if (text.includes('happy') || text.includes('job') || text.includes('pass') ||
      text.includes('selected') || text.includes('success')) {
    return _pickRandom(REPLY_POOLS.happy);
  }

  return _pickRandom(REPLY_POOLS.general);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — pick 3 distinct random items from pool
// ─────────────────────────────────────────────────────────────────────────────
function _pickRandom(pool) {
  if (!pool || pool.length === 0) return REPLY_POOLS.general;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(3, shuffled.length));
}

module.exports = {
  generateHumanReply
};
