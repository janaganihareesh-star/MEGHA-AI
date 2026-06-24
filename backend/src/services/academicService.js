/**
 * academicService.js — Engine 43
 * Academic Document Engine: assignments, reports, PPT, viva, lab records
 */

const axios = require('axios');

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') return { mock: true };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function generateAssignment({ subject, topic, wordCount = 1000, level = 'undergraduate', language = 'English', includeReferences = true }) {
  const prompt = `Write a complete academic assignment on: "${topic}"
Subject: ${subject} | Level: ${level} | Words: ${wordCount} | Language: ${language}

Structure: Title → Abstract (if applicable) → Introduction → Main sections → Analysis/Discussion → Conclusion → References
${includeReferences ? 'Include 5-7 real-looking academic references in APA format.' : ''}

Return JSON:
{
  "title": "string",
  "abstract": "string or null",
  "content": "string (full assignment in markdown)",
  "sections": [{"heading":"","content":""}],
  "references": [],
  "wordCount": ${wordCount},
  "plagiarismTip": "string",
  "keyPoints": []
}`;
  return callGemini(prompt, 3000);
}

async function generateReport({ type, subject, topic, level = 'undergraduate', language = 'English' }) {
  const isProject = type === 'project';
  const prompt = `Generate a complete ${isProject ? 'project' : 'seminar'} report on: "${topic}"
Subject: ${subject} | Level: ${level} | Language: ${language}

${isProject ? `Project report sections: Abstract → Introduction → Literature Review → Methodology → Implementation → Results → Conclusion → Future Work → References` : `Seminar report sections: Abstract → Introduction → Background → Core Content → Discussion → Conclusion → References`}

Return JSON:
{
  "title": "string",
  "abstract": "string",
  "sections": [{"title":"","content":""}],
  "formattedText": "string (complete report)",
  "references": [],
  "figures": [{"title":"","description":""}],
  "pageCount": 0,
  "wordCount": 0
}`;
  return callGemini(prompt, 3000);
}

async function generatePPTContent({ topic, slideCount = 10, audience = 'students', level = 'undergraduate', language = 'English' }) {
  const prompt = `Create ${slideCount}-slide presentation content for: "${topic}"
Audience: ${audience} | Level: ${level} | Language: ${language}

Rules:
- Title slide + Table of contents + content slides + Q&A slide
- Max 5-6 bullet points per slide
- Clear, concise language
- Include speaker notes

Return JSON:
{
  "title": "string",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title|content|agenda|conclusion|qa",
      "title": "string",
      "bullets": [],
      "speakerNotes": "string",
      "visualSuggestion": "string (what image/chart would suit)"
    }
  ],
  "theme": "Professional",
  "totalSlides": ${slideCount}
}`;
  return callGemini(prompt, 2048);
}

async function generateVivaQuestions({ subject, topic, level = 'undergraduate', count = 20, language = 'English' }) {
  const prompt = `Generate ${count} viva voce questions for ${subject} — "${topic}".
Level: ${level} | Language: ${language}
Mix: basic (30%) + intermediate (50%) + advanced (20%)

Return JSON:
{
  "questions": [
    {
      "question": "string",
      "expectedAnswer": "string",
      "difficulty": "basic|intermediate|advanced",
      "topic": "string",
      "followUp": "string or null"
    }
  ],
  "examTips": [],
  "keyTopicsToRevise": []
}`;
  return callGemini(prompt, 2048);
}

async function generateLabRecord({ subject, experimentName, aim, materials, procedure, language = 'English' }) {
  const prompt = `Generate a complete lab record for:
Subject: ${subject}
Experiment: ${experimentName}
Aim: ${aim}
Materials: ${materials}
Procedure: ${procedure}
Language: ${language}

Return JSON:
{
  "experimentNumber": "string",
  "title": "${experimentName}",
  "aim": "${aim}",
  "materials": [],
  "theory": "string",
  "procedure": [],
  "observations": "string (sample table description)",
  "calculations": "string",
  "results": "string",
  "precautions": [],
  "conclusion": "string",
  "formattedText": "string (complete lab record)"
}`;
  return callGemini(prompt, 2048);
}

async function generateResearchSummary({ topic, paperTitle, abstract, findings, language = 'English' }) {
  const prompt = `Create a research paper summary for students/readers.
Topic: ${topic}
${paperTitle ? `Paper: "${paperTitle}"` : ''}
${abstract ? `Abstract: ${abstract}` : ''}
${findings ? `Key findings: ${findings}` : ''}
Language: ${language}

Return JSON:
{
  "summary": "string (clear, readable summary)",
  "keyContributions": [],
  "methodology": "string",
  "findings": [],
  "limitations": [],
  "futureWork": [],
  "citationAPA": "string",
  "relevanceScore": 0
}`;
  return callGemini(prompt, 1024);
}

module.exports = {
  generateAssignment,
  generateReport,
  generatePPTContent,
  generateVivaQuestions,
  generateLabRecord,
  generateResearchSummary
};
