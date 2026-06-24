/**
 * documentIntelligenceService.js — Engine 36
 * Upload & analyze documents: summarize, explain, translate, MCQ, interview Q gen
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function callGemini(prompt, maxTokens = 2048, jsonMode = true) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return jsonMode ? { mock: true } : { text: 'Configure GEMINI_API_KEY.' };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.5, maxOutputTokens: maxTokens,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  if (!jsonMode) return { text };
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

// ─── Extract text from uploaded file ──────────────────────────────────────
async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.docx') {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === '.xlsx' || ext === '.xls') {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(name => {
      const sheet = workbook.Sheets[name];
      text += `\n--- Sheet: ${name} ---\n`;
      text += XLSX.utils.sheet_to_csv(sheet);
    });
    return text;
  }

  if (ext === '.txt' || ext === '.md') {
    return fs.readFileSync(filePath, 'utf8');
  }

  return 'Unable to extract text from this file type automatically.';
}

// ─── SUMMARIZE ─────────────────────────────────────────────────────────────
async function summarizeDocument({ text, language = 'English', length = 'medium' }) {
  const wordLimit = length === 'short' ? 150 : length === 'long' ? 500 : 250;
  const prompt = `Summarize this document in ${wordLimit} words.
Language: ${language}
Document: ${text.substring(0, 8000)}

Return JSON:
{
  "summary": "string",
  "keyPoints": [],
  "mainTopics": [],
  "documentType": "string (what kind of document this appears to be)",
  "wordCount": 0,
  "readingTime": "string"
}`;
  return callGemini(prompt, 1024);
}

// ─── EXPLAIN ───────────────────────────────────────────────────────────────
async function explainDocument({ text, language = 'English', level = 'intermediate' }) {
  const prompt = `Explain this document in simple, clear terms for a ${level} reader.
Language: ${language}
Document: ${text.substring(0, 6000)}

Return JSON:
{
  "explanation": "string (clear explanation in simple language)",
  "keyTerms": [{"term":"","definition":""}],
  "importantConcepts": [],
  "simplifiedVersion": "string",
  "questions": []
}`;
  return callGemini(prompt, 1024);
}

// ─── TRANSLATE ─────────────────────────────────────────────────────────────
async function translateDocument({ text, targetLanguage, sourceLanguage = 'auto', preserveFormatting = true }) {
  const prompt = `Translate this document to ${targetLanguage}.
${sourceLanguage !== 'auto' ? `Source language: ${sourceLanguage}` : 'Auto-detect source language.'}
${preserveFormatting ? 'Preserve original formatting and structure.' : ''}
Document: ${text.substring(0, 6000)}

Return JSON:
{
  "translatedText": "string",
  "detectedSourceLanguage": "string",
  "targetLanguage": "${targetLanguage}",
  "preservedFormatting": true,
  "glossary": [{"original":"","translated":""}]
}`;
  return callGemini(prompt, 2048);
}

// ─── GENERATE MCQs ─────────────────────────────────────────────────────────
async function generateMCQs({ text, count = 10, difficulty = 'medium', language = 'English' }) {
  const prompt = `Generate ${count} multiple choice questions from this document.
Difficulty: ${difficulty}. Language: ${language}
Document: ${text.substring(0, 6000)}

Return JSON:
{
  "mcqs": [
    {
      "question": "string",
      "options": { "A": "", "B": "", "C": "", "D": "" },
      "correctAnswer": "A|B|C|D",
      "explanation": "string",
      "difficulty": "easy|medium|hard",
      "topic": "string"
    }
  ],
  "totalQuestions": ${count},
  "topicsCovered": []
}`;
  return callGemini(prompt, 2048);
}

// ─── GENERATE INTERVIEW QUESTIONS ──────────────────────────────────────────
async function generateInterviewQuestions({ text, role = '', count = 10, language = 'English' }) {
  const prompt = `Generate ${count} interview questions based on this document.
${role ? `For role: ${role}` : ''}
Language: ${language}
Document: ${text.substring(0, 5000)}

Return JSON:
{
  "questions": [
    {
      "question": "string",
      "type": "conceptual|behavioral|technical|situational",
      "expectedAnswer": "string",
      "followUp": "string",
      "difficulty": "easy|medium|hard"
    }
  ],
  "totalQuestions": ${count},
  "recommendedFor": "string"
}`;
  return callGemini(prompt, 2048);
}

// ─── EXTRACT TABLES ────────────────────────────────────────────────────────
async function extractTables({ text }) {
  const prompt = `Extract all tables and structured data from this document.
Document: ${text.substring(0, 6000)}

Return JSON:
{
  "tables": [
    {
      "title": "string",
      "headers": [],
      "rows": [],
      "description": "string"
    }
  ],
  "structuredData": [],
  "listsFound": []
}`;
  return callGemini(prompt, 1024);
}

// ─── GENERATE NOTES ────────────────────────────────────────────────────────
async function generateNotes({ text, style = 'cornell', language = 'English' }) {
  const prompt = `Generate ${style} style study notes from this document.
Language: ${language}
Document: ${text.substring(0, 6000)}

Return JSON:
{
  "notes": {
    "mainPoints": [],
    "subPoints": [],
    "keyFacts": [],
    "definitions": [{"term":"","definition":""}],
    "examples": [],
    "summary": "string"
  },
  "flashcards": [{"front":"","back":""}],
  "mindMapStructure": {"center":"","branches":[]}
}`;
  return callGemini(prompt, 1500);
}

// ─── CONVERT FORMAT ────────────────────────────────────────────────────────
async function convertFormat({ text, fromFormat, toFormat, language = 'English' }) {
  const prompt = `Convert this ${fromFormat} document to ${toFormat} format.
Language: ${language}
Document: ${text.substring(0, 5000)}

Return JSON:
{
  "convertedContent": "string",
  "fromFormat": "${fromFormat}",
  "toFormat": "${toFormat}",
  "conversionNotes": "string"
}`;
  return callGemini(prompt, 2048);
}

module.exports = {
  extractText,
  summarizeDocument,
  explainDocument,
  translateDocument,
  generateMCQs,
  generateInterviewQuestions,
  extractTables,
  generateNotes,
  convertFormat
};
