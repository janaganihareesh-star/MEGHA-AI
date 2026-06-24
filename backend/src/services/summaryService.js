const axios = require('axios');
const ConversationSummary = require('../models/ConversationSummary');
const Message = require('../models/Message');

async function generateSummary({ userId, month, year }) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Load messages within the target month range
    const messages = await Message.find({
      userId,
      timestamp: { $gte: startDate, $lt: endDate }
    }).sort({ timestamp: 1 });

    const totalMessages = messages.length;
    if (totalMessages === 0) {
      return null;
    }

    // Capture representative samples (up to 100) for Gemini context mapping
    const textSample = messages
      .slice(0, 100)
      .map(m => `${m.sender === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n');

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
      const mockSummary = await ConversationSummary.create({
        userId,
        month,
        year,
        summary: 'Mock Summary: We spoke about goals, tech roadmaps, and career growth.',
        achievements: ['Worked hard on career learning goals'],
        moodChanges: 'Positive emotional stability',
        keyTopics: ['MERN Dev', 'Mock Interviews', 'Daily Wellness'],
        importantMemories: ['User shared their career ambitions'],
        totalMessages
      });
      return mockSummary;
    }

    const systemPrompt = `You are a helpful companion summarizing the past month's conversations.
Extract key topics, personal memories, achievements discussed, and analyze the user's mood transition.
Return ONLY a JSON response:
{
  "summary": "Provide a warm 3-4 sentence paragraph summary of what the user discussed...",
  "achievements": ["List key achievements user shared or goal updates"],
  "moodChanges": "Summarize how user mood changed",
  "keyTopics": ["Topic A", "Topic B"],
  "importantMemories": ["Specific memory user shared"]
}
Do not wrap in markdown code blocks.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: `Here is a sample transcripts of our discussions:\n${textSample}` }] }
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.3,
        responseMimeType: 'application/json'
      }
    };

    const response = await axios.post(url, requestBody);
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (parseErr) {
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    const summaryObj = await ConversationSummary.create({
      userId,
      month,
      year,
      summary: parsedResult.summary || 'A wonderful month of bonding.',
      achievements: parsedResult.achievements || [],
      moodChanges: parsedResult.moodChanges || 'Balanced and calm.',
      keyTopics: parsedResult.keyTopics || [],
      importantMemories: parsedResult.importantMemories || [],
      totalMessages
    });

    return summaryObj;
  } catch (err) {
    console.error('Failed generating monthly summary:', err.message);
    return null;
  }
}

module.exports = {
  generateSummary
};
