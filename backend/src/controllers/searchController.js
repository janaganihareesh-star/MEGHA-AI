/**
 * searchController.js
 * Section 110 — Search / Research Engine
 * Web Search | Specialized Modes | Deep Research
 */

const axios = require('axios');
const UserPreference = require('../models/UserPreference');
const SearchHistory = require('../models/SearchHistory');

// ─── In-memory cache (5 min TTL for news, 24hr for facts) ─────────────────────
const searchCache = new Map();
const CACHE_TTL = {
  news: 5 * 60 * 1000,       // 5 minutes
  default: 24 * 60 * 60 * 1000 // 24 hours
};

function getCached(key) {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) { searchCache.delete(key); return null; }
  return entry.data;
}
function setCache(key, data, ttl) {
  searchCache.set(key, { data, timestamp: Date.now(), ttl });
}

// ─── Detect search intent ─────────────────────────────────────────────────────
function detectIntent(query) {
  const q = query.toLowerCase();
  if (/latest|recent|news|update|today|eeroju/.test(q)) return 'news';
  if (/how to|how do|ela|steps|chesedhi/.test(q)) return 'how-to';
  if (/ vs |versus|better or|difference between/.test(q)) return 'compare';
  if (/visa|passport|immigration|pr |move to/.test(q)) return 'visa';
  if (/scheme|yojana|government|subsidy|apply for/.test(q)) return 'schemes';
  if (/symptom|medicine|disease|hospital|doctor|health/.test(q)) return 'health';
  if (/java|python|react|node|ai |ml |aws|docker|framework|version|features/.test(q)) return 'tech';
  if (/what is|ante enti|means|define|explain/.test(q)) return 'fact';
  return 'general';
}

// ─── Call Google Custom Search API ────────────────────────────────────────────
async function webSearch(query, numResults = 5) {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const cx = process.env.SEARCH_ENGINE_ID;

  if (!apiKey || !cx || apiKey === 'your_key') {
    // Fallback mock for development
    return [
      { title: `Search result for: ${query}`, snippet: 'Configure GOOGLE_SEARCH_API_KEY and SEARCH_ENGINE_ID in .env for real results.', link: 'https://google.com', displayLink: 'google.com' }
    ];
  }

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=${numResults}`;
  const res = await axios.get(url);
  return (res.data?.items || []).map(item => ({
    title: item.title,
    snippet: item.snippet,
    link: item.link,
    displayLink: item.displayLink,
    date: item.pagemap?.metatags?.[0]?.['article:published_time'] || null
  }));
}

// ─── Summarize with Gemini ────────────────────────────────────────────────────
async function summarizeWithGemini(query, sources, language, format, intent) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { summary: `Search results for: ${query}. Configure GEMINI_API_KEY for AI summaries.`, sources };
  }

  const disclaimers = {
    health: '\n\n⚕️ DISCLAIMER: Ee information general gaa undi. Doctor ni consult cheyyandi. Medical emergency lo 112 ki call cheyyandi.',
    visa: '\n\n⚠️ DISCLAIMER: Verify on official government website. Immigration rules change frequently. Consult a licensed agent.',
    schemes: '\n\nOfficial source: india.gov.in'
  };

  const prompt = `Summarize search results for: "${query}"

Sources:
${sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join('\n')}

Rules:
1. Current, accurate information only
2. Cite sources: "According to [Source]..."
3. If info conflicts: mention both versions
4. Tone: conversational friend, not academic paper
5. For news: lead with most important fact first
6. For how-to: numbered steps  
7. For visa/govt: always add official website link
8. Format: ${format || 'detailed'}
9. Language: ${language}
${disclaimers[intent] ? `10. Append this disclaimer: ${disclaimers[intent]}` : ''}

Return ONLY valid JSON:
{
  "summary": "string",
  "keyPoints": [],
  "confidence": "high|medium|low",
  "freshness": "string or null",
  "disclaimer": "string or null"
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 1024, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WEB SEARCH — Real-Time Summarized Answers
// POST /api/search/query
// ─────────────────────────────────────────────────────────────────────────────
exports.searchQuery = async (req, res, next) => {
  try {
    const { query, format, depth } = req.body;
    const userId = req.user.id;

    if (!query) return res.status(400).json({ success: false, message: 'query is required.' });

    const pref = await UserPreference.findOne({ userId }).select('language').lean();
    const language = pref?.language || 'English';

    const intent = detectIntent(query);
    const cacheKey = `${query.toLowerCase()}_${language}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, ...cached, fromCache: true });
    }

    // Web search
    const numResults = depth === 'deep' ? 8 : 5;
    const sources = await webSearch(query, numResults);

    // Gemini summarize
    const summary = await summarizeWithGemini(query, sources, language, format, intent);

    const result = {
      query, intent, language,
      ...summary,
      sources: sources.map(s => ({ title: s.title, url: s.link, domain: s.displayLink, date: s.date }))
    };

    // Cache
    const ttl = intent === 'news' ? CACHE_TTL.news : CACHE_TTL.default;
    setCache(cacheKey, result, ttl);

    // Save to history
    SearchHistory.create({
      userId, query, intent,
      summary: summary.summary,
      sources: result.sources,
      language, searchMode: 'quick'
    }).catch(() => {});

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. DEEP RESEARCH MODE — Multi-Source Analysis
// POST /api/search/deep-research
// ─────────────────────────────────────────────────────────────────────────────
exports.deepResearch = async (req, res, next) => {
  try {
    const { topic, outputFormat, depth } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: 'topic is required.' });

    const pref = await UserPreference.findOne({ userId: req.user.id }).select('language').lean();
    const language = pref?.language || 'English';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      return res.status(200).json({ success: true, mock: true, report: { executiveSummary: 'Configure GEMINI_API_KEY for deep research.' } });
    }

    // Step 1: Decompose topic into sub-questions
    const decomposeUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const decomposeRes = await axios.post(decomposeUrl, {
      contents: [{ role: 'user', parts: [{ text: `Break this research topic into 3-4 specific sub-questions for comprehensive research: "${topic}". Return ONLY valid JSON: { "subQuestions": [] }` }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 512, responseMimeType: 'application/json' }
    });
    const decomposeText = decomposeRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let subQuestions = [];
    try {
      subQuestions = JSON.parse(decomposeText).subQuestions || [];
    } catch { subQuestions = [topic]; }

    // Step 2: Search all sub-questions in parallel
    const searchResults = await Promise.all(
      subQuestions.map(q => webSearch(q, depth === 'deep' ? 5 : 3))
    );
    const allSources = searchResults.flat();

    // Step 3: Synthesize
    const synthPrompt = `Write a comprehensive research report on: "${topic}"

Sources collected:
${allSources.slice(0, 10).map((s, i) => `[${i + 1}] ${s.title}: ${s.snippet}`).join('\n')}

Sub-questions analyzed:
${subQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Structure:
1. Executive Summary (3 sentences)
2. Key Findings (5-7 points with source citations)
3. Different perspectives / controversies (if any)
4. Current state (as of ${new Date().toLocaleDateString()})
5. Implications for a regular person
6. Sources list

Tone: Journalistic — objective, clear, no fluff
Format: ${outputFormat || 'report'}
Language: ${language}

Return ONLY valid JSON:
{
  "title": "string",
  "executiveSummary": "string",
  "keyFindings": [{ "finding": "", "source": "" }],
  "perspectives": [],
  "currentState": "string",
  "implications": "string",
  "sources": [{ "title": "", "url": "" }],
  "tableOfContents": []
}`;

    const synthRes = await axios.post(decomposeUrl, {
      contents: [{ role: 'user', parts: [{ text: synthPrompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2048, responseMimeType: 'application/json' }
    });
    const synthText = synthRes.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    let report = {};
    try { report = JSON.parse(synthText); }
    catch { report = JSON.parse(synthText.replace(/```json/g, '').replace(/```/g, '').trim()); }

    // Save to history
    SearchHistory.create({
      userId: req.user.id, query: topic, intent: 'general',
      summary: report.executiveSummary,
      sources: report.sources || [],
      language, searchMode: 'deep'
    }).catch(() => {});

    res.status(200).json({ success: true, topic, report, subQuestionsAnalyzed: subQuestions });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. SEARCH HISTORY
// GET /api/search/history
// DELETE /api/search/history/:id
// PUT /api/search/history/:id/pin
// ─────────────────────────────────────────────────────────────────────────────
exports.getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.status(200).json({ success: true, history });
  } catch (err) {
    next(err);
  }
};

exports.pinSearch = async (req, res, next) => {
  try {
    const search = await SearchHistory.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      [{ $set: { isPinned: { $not: '$isPinned' } } }], // toggle
      { new: true }
    );
    res.status(200).json({ success: true, isPinned: search?.isPinned });
  } catch (err) {
    next(err);
  }
};

exports.deleteSearch = async (req, res, next) => {
  try {
    await SearchHistory.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ success: true, message: 'Search removed from history.' });
  } catch (err) {
    next(err);
  }
};
