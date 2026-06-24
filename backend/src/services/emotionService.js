/**
 * emotionService.js
 * Layer 4 — Emotion Engine from Master Prompt System
 * Multi-language keyword detection + energy level + Gemini fallback
 */

const axios = require('axios');
const MoodLog = require('../models/MoodLog');

// ─────────────────────────────────────────────────────────────────────────────
// KEYWORD MAPPINGS — all 7 emotion states from Layer 4
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORD_MAPPINGS = [
  {
    mood: 'sad',
    keywords: [
      // English
      'breakup', 'broke up', 'alone', 'crying', 'hopeless', 'depressed', 'depression',
      'heartbroken', 'miss you', 'pain', 'hurt', 'nothing feels right',
      // Telugu
      'baadha', 'chachipoyali', 'devudu', 'jeevitam vaddu', 'vaddanipistundi',
      'emi cheyalo teliduu', 'ontariga', 'kanneeru',
      // Hindi
      'dukhi', 'rona aa raha', 'dil toot gaya', 'akela', 'udaas'
    ]
  },
  {
    mood: 'happy',
    keywords: [
      // English
      'got a job', 'offer letter', 'selected', 'pass', 'promoted', 'success', 'happy',
      'great news', 'delighted', 'excited', 'won', 'amazing', 'finally did it', 'nailed it',
      // Telugu
      'job vacchindi', 'pass ayyanu', 'chala happy', 'wah', 'super', 'sankosham',
      'chesanu chesanu', 'ayipoyindi', 'great ayyindi',
      // Hindi
      'khush', 'bahut accha', 'maza aa gaya', 'kamaal', 'dil khush'
    ]
  },
  {
    mood: 'angry',
    keywords: [
      // English
      'angry', 'frustrated', 'hate', 'unfair', 'betrayed', 'cheated', 'irritated',
      'worst', 'furious', 'annoyed', 'pissed off', 'this is stupid',
      // Telugu
      'kopam', 'gussa', 'irritate chesindi', 'chesindi chuda', 'dabba',
      // Hindi
      'gussa', 'naraaz', 'pagal kar diya', 'ye galat hai', 'bekar'
    ]
  },
  {
    mood: 'lonely',
    keywords: [
      // English
      'no one', 'nobody', 'lonely', 'isolated', 'miss', 'silent', 'alone', 'forgotten',
      'no friends', 'no one cares', 'all by myself',
      // Telugu
      'evaru leru', 'ontariga undi', 'manshi leru', 'miss chesanu',
      // Hindi
      'koi nahi', 'akela hoon', 'koi nahi sunta', 'dost nahi'
    ]
  },
  {
    mood: 'anxious',
    keywords: [
      // English
      'nervous', 'worried', 'scared', 'tense', 'anxious', 'panicking', 'panicked',
      'what if', 'overthinking', 'can\'t sleep', 'fear', 'terrified',
      // Telugu
      'bayam ga undi', 'tension ga undi', 'worry avutunna', 'em avutundo teliduu',
      // Hindi
      'dar lag raha', 'tension hai', 'ghabra raha hoon', 'kya hoga'
    ]
  },
  {
    mood: 'tired',
    keywords: [
      // English
      'tired', 'exhausted', 'drained', 'sleepy', 'no energy', 'burnt out', 'burnout',
      'weary', 'worn out', 'rest', 'sleep',
      // Telugu
      'tired ga undi', 'chala abba', 'abba', 'niluvunaleduu', 'rest kavali',
      // Hindi
      'thak gaya', 'thak gayi', 'bilkul nahi', 'neend aa rahi'
    ]
  },
  {
    mood: 'excited',
    keywords: [
      // English
      'so excited', 'can\'t wait', 'wow', 'omg', 'amazing', 'this is it', 'yes!',
      'finally', 'let\'s go', 'pumped',
      // Telugu
      'chala excited', 'antaku antaku', 'chusindi chusindi', 'yess',
      // Hindi
      'bahut excited', 'ho gaya', 'yaar sun', 'mast'
    ]
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// ENERGY LEVEL DETECTION (from Layer 4)
// ─────────────────────────────────────────────────────────────────────────────
function detectEnergyLevel(text) {
  if (!text) return 'medium';
  const lower = text.trim().toLowerCase();
  const wordCount = lower.split(/\s+/).length;
  const exclamations = (lower.match(/[!?]+/g) || []).length;
  const emojis = (text.match(/[\u{1F300}-\u{1FFFF}]/gu) || []).length;

  const shortReplies = ['k', 'ok', 'sare', 'hmm', 'ya', 'ha', 'ji', 'hm', 'fine', '.', 'k.', 'accha', 'oh'];
  if (shortReplies.includes(lower) || wordCount <= 2) return 'low';
  if (wordCount > 30 || exclamations >= 2 || emojis >= 3) return 'high';
  return 'medium';
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DETECT EMOTION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────
async function detectEmotion({ userId, text, history = [] }) {
  if (!text) {
    return { mood: 'neutral', confidence: 100, energyLevel: 'medium', method: 'default' };
  }

  const lowerText = text.toLowerCase();
  const energyLevel = detectEnergyLevel(text);

  // STEP 1 — Keyword fast path
  for (const mapping of KEYWORD_MAPPINGS) {
    if (mapping.keywords.some(kw => lowerText.includes(kw))) {
      const result = {
        mood: mapping.mood,
        confidence: 82,
        energyLevel,
        method: 'keyword'
      };

      if (userId) {
        await MoodLog.create({
          userId,
          mood: mapping.mood,
          confidence: 82,
          messageText: text
        }).catch(() => {}); // Non-blocking
      }

      return result;
    }
  }

  // STEP 2 — Bypass Gemini API for extreme speed and to avoid rate limits
  const fallback = { mood: 'neutral', confidence: 50, energyLevel, method: 'length-heuristic' };
  if (userId) {
    await MoodLog.create({ userId, mood: 'neutral', confidence: 50, messageText: text }).catch(() => {});
  }
  return fallback;
}

async function detectEmotionAI({ userId, text, energyLevel, apiKey }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const systemPrompt = `Analyze the emotional state in this message. Return ONLY valid JSON: {"mood": "...", "confidence": 0-100}
Mood options: sad, happy, angry, lonely, anxious, tired, excited, calm, frustrated, neutral
Message: "${text}"
Do NOT wrap in markdown. Return only raw JSON.`;

  try {
    const response = await axios.post(url, {
      contents: [{ role: 'user', parts: [{ text: `Analyze: "${text}"` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.1, responseMimeType: 'application/json' }
    });

    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    const mood       = parsedResult.mood || 'neutral';
    const confidence = parsedResult.confidence || 60;

    if (userId) {
      await MoodLog.create({ userId, mood, confidence, messageText: text }).catch(() => {});
    }

    return { mood, confidence, energyLevel, method: 'ai' };
  } catch (err) {
    console.error('AI emotion detection failed:', err.message);
    const fallback = { mood: 'neutral', confidence: 50, energyLevel, method: 'fallback' };
    if (userId) {
      await MoodLog.create({ userId, mood: 'neutral', confidence: 50, messageText: text }).catch(() => {});
    }
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MOOD TREND — last N days analytics
// ─────────────────────────────────────────────────────────────────────────────
async function getMoodTrend({ userId, days = 30 }) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const moodLogs = await MoodLog.find({ userId, timestamp: { $gte: sinceDate } });

  const totals = {};
  moodLogs.forEach(log => {
    totals[log.mood] = (totals[log.mood] || 0) + 1;
  });

  const logCount = moodLogs.length || 1;
  const trend = {};
  Object.keys(totals).forEach(mood => {
    trend[mood] = Math.round((totals[mood] / logCount) * 100);
  });

  const mostCommon = Object.keys(totals).sort((a, b) => totals[b] - totals[a])[0] || 'neutral';

  return { period: `${days} days`, trend, mostCommonMood: mostCommon, totalLogs: moodLogs.length };
}

module.exports = {
  detectEmotion,
  detectEnergyLevel,
  getMoodTrend
};
