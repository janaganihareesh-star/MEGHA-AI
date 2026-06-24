/**
 * calculationService.js — Engine 44
 * Aptitude, Engineering Math, Statistics, Finance — step-by-step solutions
 */

const axios = require('axios');

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') return { mock: true };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function solveProblem({ problem, type = 'general', language = 'English', showSteps = true }) {
  const typeGuide = {
    aptitude: 'speed/distance/time, profit/loss, percentage, ratio, probability, permutation, combination',
    engineering: 'calculus, matrices, differential equations, numerical methods, transforms',
    statistics: 'mean, median, mode, standard deviation, probability distributions, hypothesis testing',
    finance: 'simple/compound interest, EMI, ROI, NPV, IRR, depreciation, tax calculation',
    general: 'any mathematical problem'
  }[type] || 'general';

  const prompt = `Solve this ${type} math problem step by step.
Problem: "${problem}"
Type category: ${typeGuide}
Language: ${language}
${showSteps ? 'Show every step clearly with explanations.' : 'Provide direct solution.'}

Return JSON:
{
  "problem": "${problem.replace(/"/g, '\\"')}",
  "type": "${type}",
  "steps": [
    {"stepNumber": 1, "description": "string", "calculation": "string", "result": "string"}
  ],
  "finalAnswer": "string",
  "formula": "string (main formula used)",
  "verification": "string (how to verify the answer)",
  "alternateMethod": "string or null",
  "tips": [],
  "relatedConcepts": []
}`;
  return callGemini(prompt, 2048);
}

async function explainFormula({ formula, language = 'English' }) {
  const prompt = `Explain this mathematical formula: "${formula}"
Language: ${language}

Return JSON:
{
  "formula": "${formula.replace(/"/g, '\\"')}",
  "name": "string (formal name of this formula)",
  "explanation": "string (what it means in plain English)",
  "variables": [{"symbol":"","meaning":"","unit":"string or null"}],
  "when_to_use": "string",
  "example": {"problem":"","solution":""},
  "derivation": "string (brief derivation if applicable)",
  "commonMistakes": [],
  "relatedFormulas": []
}`;
  return callGemini(prompt, 1024);
}

async function generatePracticeProblems({ topic, difficulty = 'medium', count = 5, type = 'aptitude', language = 'English' }) {
  const prompt = `Generate ${count} ${difficulty} ${type} problems on topic: "${topic}"
Language: ${language}

Return JSON:
{
  "topic": "${topic}",
  "problems": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "solution": {"steps":[],"finalAnswer":"string"},
      "difficulty": "${difficulty}",
      "formula": "string",
      "timeLimit": "string"
    }
  ]
}`;
  return callGemini(prompt, 2048);
}

module.exports = { solveProblem, explainFormula, generatePracticeProblems };
