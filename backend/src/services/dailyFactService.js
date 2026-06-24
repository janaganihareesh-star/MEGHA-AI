const axios = require('axios');
const DailyFact = require('../models/DailyFact');

async function generateDailyFact(userId, language = 'English', factType = 'general') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    const fallbackFacts = {
      'science': 'The universe contains more stars than all the grains of sand on Earth combined.',
      'psychology': 'Our brains are wired for connection; positive relationships boost longevity and mood.',
      'history': 'Ancient Romans used to believe that wearing amethyst prevented them from getting drunk.',
      'general': 'Honey never spoils. Pots of honey over 3,000 years old found in Egyptian tombs are still edible.'
    };
    const fact = fallbackFacts[factType] || fallbackFacts['general'];
    return await DailyFact.create({
      userId,
      factType,
      fact,
      language
    });
  }

  const systemPrompt = `Generate a single, interesting, short and verified fact about the category "${factType}".
Return the fact ONLY in ${language}. Limit to 1-2 sentences.
Return ONLY JSON response: {"fact": "..."}. Do not wrap in code blocks.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      { role: 'user', parts: [{ text: 'Generate daily fact' }] }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = await axios.post(url, requestBody);
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (err) {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    return await DailyFact.create({
      userId,
      factType,
      fact: parsedResult.fact || 'Honey never spoils.',
      language
    });
  } catch (err) {
    console.error('Failed generating daily fact:', err.message);
    return await DailyFact.create({
      userId,
      factType,
      fact: 'Honey never spoils.',
      language
    });
  }
}

module.exports = {
  generateDailyFact
};
