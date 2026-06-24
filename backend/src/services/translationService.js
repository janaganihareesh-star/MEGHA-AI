/**
 * translationService.js — Engine 39
 * Universal Translation Engine — All Indian + International Languages
 */

const axios = require('axios');

const SUPPORTED_LANGUAGES = {
  indian: ['Telugu','Hindi','Tamil','Kannada','Malayalam','Bengali','Gujarati','Marathi','Punjabi','Odia','Urdu','Assamese','Sanskrit'],
  international: ['English','French','German','Spanish','Portuguese','Italian','Japanese','Chinese','Korean','Arabic','Russian','Dutch','Turkish','Vietnamese','Thai']
};

async function callGemini(prompt, maxTokens = 2048, jsonMode = true) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return jsonMode ? { mock: true, translatedText: 'Configure GEMINI_API_KEY.' } : { text: 'Configure GEMINI_API_KEY.' };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3, maxOutputTokens: maxTokens,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  if (!jsonMode) return { text };
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function translateText({ text, targetLanguage, sourceLanguage = 'auto', style = 'natural', context = '' }) {
  const styleGuide = {
    formal: 'Use formal register, professional vocabulary. Perfect for official documents.',
    casual: 'Use conversational, friendly language. Natural and easy to read.',
    professional: 'Business-appropriate, polished, precise terminology.',
    natural: 'Match the original tone and style, sound like a native speaker.'
  }[style] || 'natural, fluent translation';

  const prompt = `Translate to ${targetLanguage}.
${sourceLanguage !== 'auto' ? `Source: ${sourceLanguage}` : 'Auto-detect source language.'}
Style: ${styleGuide}
${context ? `Context: ${context}` : ''}

Text to translate:
"""
${text.substring(0, 5000)}
"""

Return JSON:
{
  "translatedText": "string",
  "detectedLanguage": "string",
  "targetLanguage": "${targetLanguage}",
  "style": "${style}",
  "alternativeTranslations": [],
  "culturalNotes": "string or null",
  "glossary": [{"original":"","translated":""}]
}`;
  return callGemini(prompt, 2048);
}

async function translateDocument({ documentText, targetLanguage, sourceLanguage = 'auto', preserveStructure = true }) {
  const prompt = `Translate this entire document to ${targetLanguage}.
${sourceLanguage !== 'auto' ? `Source: ${sourceLanguage}` : 'Auto-detect.'}
${preserveStructure ? 'Preserve original document structure, headings, lists, and formatting.' : ''}

Document:
"""
${documentText.substring(0, 6000)}
"""

Return JSON:
{
  "translatedDocument": "string",
  "detectedLanguage": "string",
  "targetLanguage": "${targetLanguage}",
  "translationNotes": "string",
  "glossary": [{"term":"","translation":""}],
  "qualityScore": 0
}`;
  return callGemini(prompt, 3000);
}

async function translateChat({ message, targetLanguage, conversationContext = '' }) {
  const prompt = `Translate this chat message to ${targetLanguage}.
Keep it conversational, informal, and natural for chat context.
${conversationContext ? `Conversation context: ${conversationContext}` : ''}

Message: "${message}"

Return JSON:
{
  "translatedMessage": "string",
  "originalMessage": "${message.replace(/"/g, '\\"')}",
  "targetLanguage": "${targetLanguage}",
  "tone": "string",
  "alternatives": []
}`;
  return callGemini(prompt, 512);
}

async function detectLanguage({ text }) {
  const prompt = `Detect the language of this text and provide details.
Text: "${text.substring(0, 500)}"

Return JSON:
{
  "detectedLanguage": "string",
  "confidence": 0,
  "script": "string (Devanagari/Latin/Telugu/Arabic etc.)",
  "isRightToLeft": false,
  "suggestedTargetLanguages": []
}`;
  return callGemini(prompt, 256);
}

module.exports = {
  translateText,
  translateDocument,
  translateChat,
  detectLanguage,
  SUPPORTED_LANGUAGES
};
