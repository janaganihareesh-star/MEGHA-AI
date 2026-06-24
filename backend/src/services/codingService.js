/**
 * codingService.js — Engine 37
 * Advanced Coding Engine: generate, debug, review, optimize, test, docs, explain
 */

const axios = require('axios');

const SUPPORTED_LANGUAGES = ['java','python','javascript','typescript','c','cpp','csharp','go','rust','php','sql','kotlin','swift','ruby','dart'];

async function callGemini(prompt, maxTokens = 2048, jsonMode = true) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return jsonMode ? { mock: true } : { text: 'Configure GEMINI_API_KEY.' };
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

// ─── CODE GENERATION ───────────────────────────────────────────────────────
async function generateCode({ description, language, framework, requirements, language: lang = 'English' }) {
  const prompt = `Generate production-ready ${language} code for: ${description}
${framework ? `Framework/Library: ${framework}` : ''}
${requirements ? `Requirements: ${requirements}` : ''}

Rules:
1. Clean, readable, well-commented code
2. Follow ${language} best practices and conventions
3. Include error handling
4. Add JSDoc/docstring comments
5. If applicable, add input validation

Return JSON:
{
  "code": "string (complete code)",
  "language": "${language}",
  "explanation": "string (what it does)",
  "usage": "string (how to use)",
  "dependencies": [],
  "testExample": "string",
  "timeComplexity": "string or null",
  "spaceComplexity": "string or null",
  "linesOfCode": 0,
  "warnings": []
}`;
  return callGemini(prompt, 3000);
}

// ─── BUG DETECTION & FIX ───────────────────────────────────────────────────
async function debugCode({ code, language, errorMessage, context }) {
  const prompt = `Analyze this ${language} code for bugs and errors.
${errorMessage ? `Error: ${errorMessage}` : ''}
${context ? `Context: ${context}` : ''}

Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "bugs": [
    {
      "line": 0,
      "severity": "critical|high|medium|low",
      "type": "syntax|logic|runtime|security|performance",
      "description": "string",
      "fix": "string",
      "fixedCode": "string (just the fixed portion)"
    }
  ],
  "fixedCode": "string (complete fixed code)",
  "rootCause": "string",
  "preventionTips": [],
  "bugCount": 0
}`;
  return callGemini(prompt, 2048);
}

// ─── CODE REVIEW ───────────────────────────────────────────────────────────
async function reviewCode({ code, language, reviewType = 'full' }) {
  const reviewFocus = {
    full: 'code quality, security, performance, and best practices',
    security: 'security vulnerabilities, injection risks, authentication issues',
    performance: 'performance bottlenecks, algorithmic complexity, memory leaks',
    style: 'code style, naming conventions, readability, maintainability'
  }[reviewType] || 'all aspects';

  const prompt = `Perform a ${reviewType} code review focused on ${reviewFocus}.
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "overallScore": 0,
  "grade": "A|B|C|D|F",
  "summary": "string",
  "issues": [
    {
      "category": "security|performance|quality|style|logic",
      "severity": "critical|major|minor|info",
      "line": 0,
      "description": "string",
      "suggestion": "string",
      "fixedCode": "string or null"
    }
  ],
  "strengths": [],
  "improvements": [],
  "refactoredCode": "string (improved version of the entire code)",
  "securityRisks": [],
  "performanceScore": 0,
  "maintainabilityScore": 0
}`;
  return callGemini(prompt, 3000);
}

// ─── CODE OPTIMIZATION ─────────────────────────────────────────────────────
async function optimizeCode({ code, language, optimizationGoal = 'performance' }) {
  const prompt = `Optimize this ${language} code for ${optimizationGoal}.
Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "optimizedCode": "string (complete optimized code)",
  "improvements": [{"what":"","before":"","after":"","impact":""}],
  "beforeMetrics": {"timeComplexity":"","spaceComplexity":"","linesOfCode":0},
  "afterMetrics": {"timeComplexity":"","spaceComplexity":"","linesOfCode":0},
  "optimizationTechniques": [],
  "benchmarkEstimate": "string",
  "tradeoffs": "string"
}`;
  return callGemini(prompt, 2048);
}

// ─── UNIT TEST GENERATION ──────────────────────────────────────────────────
async function generateTests({ code, language, testFramework, coverageLevel = 'standard' }) {
  const framework = testFramework || (language === 'python' ? 'pytest' : language === 'javascript' ? 'jest' : language === 'java' ? 'JUnit' : 'xUnit');

  const prompt = `Generate ${coverageLevel} unit tests for this ${language} code using ${framework}.
Code:
\`\`\`${language}
${code}
\`\`\`

Coverage: happy path, edge cases, error cases, boundary conditions
Return JSON:
{
  "testCode": "string (complete test file)",
  "testFramework": "${framework}",
  "testCases": [
    {
      "name": "string",
      "type": "unit|integration|edge|error",
      "description": "string",
      "coverage": "string"
    }
  ],
  "totalTests": 0,
  "coverageEstimate": "string",
  "setupCode": "string or null",
  "mockingNeeded": [],
  "runCommand": "string"
}`;
  return callGemini(prompt, 2048);
}

// ─── DOCUMENTATION GENERATION ──────────────────────────────────────────────
async function generateDocumentation({ code, language, docStyle, language: lang = 'English' }) {
  const style = docStyle || (language === 'python' ? 'Google Style' : language === 'javascript' || language === 'typescript' ? 'JSDoc' : language === 'java' ? 'JavaDoc' : 'standard');

  const prompt = `Generate complete ${style} documentation for this ${language} code.
Language: ${lang}
Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "documentedCode": "string (code with all comments/docstrings added)",
  "readme": "string (markdown README for this module)",
  "apiDocs": [
    {
      "name": "string (function/class name)",
      "description": "string",
      "parameters": [{"name":"","type":"","description":"","required":true}],
      "returns": {"type":"","description":""},
      "example": "string",
      "throws": []
    }
  ],
  "docStyle": "${style}",
  "summary": "string"
}`;
  return callGemini(prompt, 3000);
}

// ─── CODE EXPLANATION ─────────────────────────────────────────────────────
async function explainCode({ code, language, level = 'intermediate', language: lang = 'English' }) {
  const prompt = `Explain this ${language} code for a ${level} developer.
Language: ${lang}
Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "overallExplanation": "string",
  "lineByLine": [{"lineRange":"","code":"","explanation":""}],
  "keyConceptsUsed": [{"concept":"","explanation":""}],
  "dataFlow": "string (how data moves through the code)",
  "potentialIssues": [],
  "relatedConcepts": [],
  "simplifiedVersion": "string (if applicable)"
}`;
  return callGemini(prompt, 2048);
}

// ─── SECURITY REVIEW ──────────────────────────────────────────────────────
async function securityReview({ code, language }) {
  const prompt = `Perform a security audit on this ${language} code.
Code:
\`\`\`${language}
${code}
\`\`\`

Check for: SQL injection, XSS, CSRF, authentication issues, authorization bypass, insecure dependencies, hardcoded secrets, input validation, output encoding, etc.

Return JSON:
{
  "securityScore": 0,
  "riskLevel": "critical|high|medium|low|safe",
  "vulnerabilities": [
    {
      "type": "string (OWASP category)",
      "severity": "critical|high|medium|low",
      "line": 0,
      "description": "string",
      "attack_scenario": "string",
      "fix": "string",
      "fixedCode": "string or null",
      "cweId": "string or null"
    }
  ],
  "secureVersion": "string (complete secure code)",
  "securityBestPractices": [],
  "dependencyRisks": []
}`;
  return callGemini(prompt, 2048);
}

module.exports = {
  generateCode,
  debugCode,
  reviewCode,
  optimizeCode,
  generateTests,
  generateDocumentation,
  explainCode,
  securityReview,
  SUPPORTED_LANGUAGES
};
