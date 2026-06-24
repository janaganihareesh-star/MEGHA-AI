/**
 * contentService.js — Engine 42
 * Content Creation Engine: blogs, articles, LinkedIn, Instagram, YouTube, SEO
 */

const axios = require('axios');

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.8, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

const CONTENT_TYPES = {
  blog: {
    generate: ({ topic, tone, length, audience, language, keywords }) => `Write a ${length || 'medium'} blog post about: "${topic}"
Tone: ${tone || 'informative'} | Audience: ${audience || 'general'} | Language: ${language}
SEO Keywords to include: ${keywords || topic}

Structure: Hook → Introduction → 3-5 main sections with H2/H3 → Examples → Conclusion → CTA

Return JSON: {
  "title": "string (SEO-optimized, 60 chars max)",
  "metaDescription": "string (155 chars max)",
  "slug": "string (URL-friendly)",
  "content": "string (full blog post in markdown)",
  "outline": [],
  "seoKeywords": [],
  "tags": [],
  "readingTime": "string",
  "wordCount": 0
}`
  },
  article: {
    generate: ({ topic, tone, length, audience, language, keywords }) => `Write a professional article about: "${topic}"
Tone: ${tone || 'authoritative'} | Audience: ${audience || 'professionals'} | Language: ${language}
Keywords: ${keywords || topic}

Return JSON: {
  "title": "string",
  "subtitle": "string",
  "content": "string (full article in markdown)",
  "keyTakeaways": [],
  "references": [],
  "seoScore": 0,
  "wordCount": 0,
  "metaDescription": "string"
}`
  },
  linkedin: {
    generate: ({ topic, tone, goal, language }) => `Write 3 LinkedIn post variants about: "${topic}"
Tone: ${tone || 'professional but personal'} | Goal: ${goal || 'engagement'} | Language: ${language}

LinkedIn rules:
- Hook in first line (before "see more")
- Blank lines between paragraphs for readability
- 3-5 relevant emojis
- End with question to drive comments
- Hashtags: 5-7 relevant ones at end

Return JSON: {
  "posts": [
    {
      "variant": "Story|Data|Opinion",
      "hook": "string (first 2 lines)",
      "body": "string (full post with emojis and spacing)",
      "hashtags": [],
      "characterCount": 0,
      "engagementTip": "string"
    }
  ]
}`
  },
  instagram: {
    generate: ({ topic, mood, niche, language }) => `Write Instagram captions + hashtag strategy for: "${topic}"
Mood: ${mood || 'inspirational'} | Niche: ${niche || 'general'} | Language: ${language}

Return JSON: {
  "captions": [
    {
      "style": "Minimal|Story|Motivational|Educational",
      "caption": "string (with emojis)",
      "hashtags": [],
      "ctaHook": "string",
      "characterCount": 0
    }
  ],
  "hashtagStrategy": {
    "niche": [],
    "trending": [],
    "broad": [],
    "branded": []
  },
  "bestPostingTime": "string"
}`
  },
  youtube: {
    generate: ({ topic, niche, duration, language }) => `Write a complete YouTube video script for: "${topic}"
Niche: ${niche || 'general'} | Duration: ${duration || '10 minutes'} | Language: ${language}

Return JSON: {
  "title": "string (click-worthy, 60 chars)",
  "description": "string (SEO-optimized, 200 chars)",
  "tags": [],
  "thumbnail": "string (visual concept description)",
  "script": {
    "hook": "string (first 30 seconds — grab attention)",
    "intro": "string",
    "sections": [{"title":"","content":"","duration":""}],
    "cta": "string (subscribe/like/comment ask)",
    "outro": "string"
  },
  "wordCount": 0,
  "estimatedDuration": "string",
  "seoScore": 0
}`
  },
  productDescription: {
    generate: ({ productName, features, audience, tone, language }) => `Write compelling product descriptions for: "${productName}"
Features: ${features} | Target: ${audience} | Tone: ${tone || 'persuasive'} | Language: ${language}

Return JSON: {
  "descriptions": {
    "short": "string (50 words — for listings)",
    "medium": "string (150 words — for product pages)",
    "long": "string (300 words — for detailed pages)"
  },
  "bulletPoints": [],
  "seoTitle": "string",
  "metaDescription": "string",
  "powerWords": []
}`
  }
};

async function generateContent({ type, options }) {
  const contentType = CONTENT_TYPES[type];
  if (!contentType) throw new Error(`Unsupported content type: ${type}`);

  const prompt = contentType.generate(options);
  return callGemini(prompt, 3000);
}

async function seoOptimize({ content, targetKeyword, language = 'English' }) {
  const prompt = `SEO-optimize this content for keyword: "${targetKeyword}"
Language: ${language}
Content: ${content.substring(0, 3000)}

Return JSON:
{
  "optimizedContent": "string",
  "seoScore": 0,
  "keywordDensity": "string",
  "improvements": [{"type":"","description":"","fixed":""}],
  "titleSuggestions": [],
  "metaDescription": "string",
  "internalLinkingSuggestions": [],
  "readabilityScore": 0,
  "schemaMarkup": "string or null"
}`;
  return callGemini(prompt, 2048);
}

module.exports = {
  generateContent,
  seoOptimize,
  CONTENT_TYPES: Object.keys(CONTENT_TYPES)
};
