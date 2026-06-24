/**
 * careerController.js
 * Section 107 — Career Hub: 7 sub-engines
 * Resume Builder | ATS Checker | Cover Letter | LinkedIn | Interview | Salary | Company Prep
 */

const axios = require('axios');
const UserPreference = require('../models/UserPreference');

// ─── Gemini helper ────────────────────────────────────────────────────────────
async function callGemini(prompt, jsonMode = true) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true, message: 'Configure GEMINI_API_KEY in .env' };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  };

  const res = await axios.post(url, body);
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

  if (jsonMode) {
    try {
      return JSON.parse(text);
    } catch {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }
  return { text };
}

// ─── Fetch language preference ────────────────────────────────────────────────
async function getUserLanguage(userId) {
  const pref = await UserPreference.findOne({ userId }).select('language aiName').lean();
  return { language: pref?.language || 'English', aiName: pref?.aiName || 'Maya' };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. RESUME BUILDER — ATS-Optimized from Scratch
// POST /api/career/resume/build
// ─────────────────────────────────────────────────────────────────────────────
exports.buildResume = async (req, res, next) => {
  try {
    const { targetRole, experience, skills, education, projects, jobDescription } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!targetRole) {
      return res.status(400).json({ success: false, message: 'targetRole is required.' });
    }

    const prompt = `Build a professional ATS-optimized resume for: ${targetRole}
Candidate: Experience: ${JSON.stringify(experience || [])}, Skills: ${JSON.stringify(skills || [])}, Education: ${JSON.stringify(education || [])}, Projects: ${JSON.stringify(projects || [])}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
Language: ${language}

RULES (non-negotiable):
1. Action verbs: Architected / Engineered / Optimized / Spearheaded
2. Quantify EVERY achievement (%, numbers, scale)
   BAD:  Worked on React project
   GOOD: Engineered React dashboard serving 50K+ users, cut load time 40%
3. ATS keywords: match exact terms from ${targetRole} job descriptions
4. Section order: Summary > Skills > Experience > Projects > Education > Certs
5. Summary: 3 sentences — who, strength, goal
6. Skills: group by category (Frontend / Backend / Cloud / Tools)
7. Each bullet: STAR implicit (Task + Action + Result)

Return JSON:
{
  "summary": "string",
  "skills": { "Frontend": [], "Backend": [], "Cloud": [], "Tools": [] },
  "experience": [{ "company": "", "role": "", "dates": "", "bullets": [] }],
  "projects": [{ "name": "", "tech": [], "bullets": [] }],
  "education": [{ "degree": "", "institution": "", "year": "", "gpa": "" }],
  "certifications": [],
  "resumeText": "full formatted plain text resume",
  "atsKeywords": [],
  "estimatedAtsScore": 0
}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, resume: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. ATS SCORE ANALYZER + KEYWORD GAP FINDER
// POST /api/career/resume/ats-check
// ─────────────────────────────────────────────────────────────────────────────
exports.atsCheck = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, message: 'resumeText and jobDescription are required.' });
    }

    const prompt = `You are an ATS scanner. Resume: ${resumeText}. JD: ${jobDescription}
Return JSON:
{
  "atsScore": 0,
  "scoreBreakdown": {
    "keywordMatch": 0,
    "formattingScore": 0,
    "experienceMatch": 0,
    "skillsMatch": 0
  },
  "matchedKeywords": [],
  "missingKeywords": [],
  "criticalMissing": [],
  "improvementSuggestions": [],
  "passStatus": false
}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, analysis: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. COVER LETTER GENERATOR — 3 tone variants
// POST /api/career/cover-letter/generate
// ─────────────────────────────────────────────────────────────────────────────
exports.generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeText, targetRole, companyName, jobDescription } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!targetRole || !companyName || !resumeText) {
      return res.status(400).json({ success: false, message: 'resumeText, targetRole, companyName are required.' });
    }

    const prompt = `Write a cover letter for ${targetRole} at ${companyName}.
Resume: ${resumeText.substring(0, 2000)}. Language: ${language}.
${jobDescription ? `Job Description: ${jobDescription.substring(0, 1000)}` : ''}

RULES — NON-NEGOTIABLE:
1. NEVER start with: "I am writing to apply" / "I am interested in"
   START with impact: a stat, a story, or bold statement
   Example: "When I reduced API response time by 60%..."
2. Para 2: connect their needs to your top 2-3 achievements
3. Para 3: why THIS company (research-based tone)
4. Closing — GOOD: "I would welcome a conversation"
             BAD:  "I hope to hear from you"
5. Max 350 words. Human, warm, NOT robotic.
6. Language: ${language}

Generate ALL 3 tones at once.
Return JSON:
{
  "professional": { "subject": "string", "body": "string" },
  "friendly": { "subject": "string", "body": "string" },
  "bold": { "subject": "string", "body": "string" }
}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, coverLetters: result, tones: ['professional', 'friendly', 'bold'] });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. LINKEDIN PROFILE OPTIMIZER
// POST /api/career/linkedin/optimize
// ─────────────────────────────────────────────────────────────────────────────
exports.optimizeLinkedIn = async (req, res, next) => {
  try {
    const { resumeText, targetRole, currentHeadline } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!resumeText || !targetRole) {
      return res.status(400).json({ success: false, message: 'resumeText and targetRole are required.' });
    }

    const prompt = `Optimize all LinkedIn sections for ${targetRole}.
Resume: ${resumeText.substring(0, 2000)}. Language: ${language}.
${currentHeadline ? `Current Headline: ${currentHeadline}` : ''}

Headline formula: {Role} | {Skill 1} + {Skill 2} | {Value prop}
Example: Full Stack Dev | MERN + AWS | Building Scalable Web Apps

Return JSON:
{
  "headline": "string (max 220 chars, keyword-rich)",
  "about": "string (max 2600 chars, story format, 1st person, hook first line, 3 paragraphs: story/skills/vision)",
  "experience": [{ "role": "", "company": "", "bullets": [] }],
  "skills": [],
  "connectionRequest": "string (max 300 chars note template)",
  "seoKeywords": []
}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, linkedin: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. INTERVIEW PREP — HR / Technical / System Design / Behavioral
// POST /api/career/interview/prep
// ─────────────────────────────────────────────────────────────────────────────
exports.interviewPrep = async (req, res, next) => {
  try {
    const { type, role, company } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!type || !role) {
      return res.status(400).json({ success: false, message: 'type and role are required.' });
    }

    let prompt = '';

    if (type === 'hr') {
      prompt = `Generate 15 HR interview questions with ideal answer frameworks for role: ${role}${company ? ` at ${company}` : ''}.

For each question include:
- Present → Past → Future framework (max 90 seconds spoken)
- Growth-focused answers (never negative about past employer)
- Specific STAR examples structure

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "string",
      "framework": "string",
      "sampleAnswer": "string",
      "tip": "string",
      "timeLimit": "string"
    }
  ]
}
Language: ${language}`;
    }

    else if (type === 'behavioral') {
      prompt = `Generate 10 behavioral interview questions using STAR method for role: ${role}.
Topics: Leadership / Conflict / Failure / Achievement / Teamwork / Adaptability

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "string",
      "starTemplate": { "situation": "", "task": "", "action": "", "result": "" },
      "exampleAnswer": "string",
      "commonMistakes": []
    }
  ]
}
Language: ${language}`;
    }

    else if (type === 'system_design') {
      const topic = company || 'URL Shortener';
      prompt = `Generate a complete system design guide for: ${topic}

Return ONLY valid JSON:
{
  "requirements": { "functional": [], "nonFunctional": [] },
  "capacityEstimation": "string",
  "highLevelDesign": "string",
  "components": [{ "name": "", "responsibility": "" }],
  "dbSchema": "string",
  "apiDesign": [{ "endpoint": "", "method": "", "request": {}, "response": {} }],
  "scalingStrategy": "string",
  "tradeoffs": "string",
  "interviewTips": []
}
Language: ${language}`;
    }

    else {
      // technical
      prompt = `Generate 20 technical interview questions for ${role}${company ? ` at ${company}` : ''}.
Mix of: conceptual (40%) + coding (30%) + problem solving (30%)

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "string",
      "expectedAnswer": "string",
      "codeExample": "string or null",
      "timeComplexity": "string or null",
      "difficulty": "easy|medium|hard",
      "followUpQuestions": [],
      "commonMistakes": []
    }
  ]
}
Language: ${language}`;
    }

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, type, prep: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/career/interview/technical — generate + evaluate
exports.technicalInterview = async (req, res, next) => {
  try {
    const { subject, difficulty, topic, userAnswer, question } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    // If userAnswer provided → evaluate it
    if (userAnswer && question) {
      const evalPrompt = `Evaluate this coding/technical answer:
Question: ${question}
User's Answer: ${userAnswer}

Return ONLY valid JSON:
{
  "correct": false,
  "score": 0,
  "feedback": "string",
  "optimizedVersion": "string or null",
  "timeComplexity": "string or null",
  "spaceComplexity": "string or null",
  "improvements": []
}
Language: ${language}`;

      const evaluation = await callGemini(evalPrompt);
      return res.status(200).json({ success: true, mode: 'evaluation', evaluation });
    }

    // Generate question
    const genPrompt = `Generate 1 ${difficulty || 'medium'} ${subject || 'general'} technical interview question${topic ? ` on topic: ${topic}` : ''}.

Return ONLY valid JSON:
{
  "question": "string",
  "expectedAnswer": "string",
  "codeExample": "string or null",
  "timeComplexity": "string or null",
  "difficulty": "${difficulty || 'medium'}",
  "followUpQuestions": [],
  "commonMistakes": []
}
Language: ${language}`;

    const result = await callGemini(genPrompt);
    res.status(200).json({ success: true, mode: 'question', question: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SALARY NEGOTIATION ENGINE
// POST /api/career/salary/research
// POST /api/career/salary/script
// ─────────────────────────────────────────────────────────────────────────────
exports.salaryResearch = async (req, res, next) => {
  try {
    const { role, location, experience, skills } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!role) return res.status(400).json({ success: false, message: 'role is required.' });

    const prompt = `Research realistic salary ranges for ${role} in ${location || 'India'} with ${experience || 0} years experience.
Skills: ${Array.isArray(skills) ? skills.join(', ') : (skills || '')}

Return ONLY valid JSON:
{
  "marketRange": { "min": 0, "max": 0, "median": 0, "currency": "INR" },
  "premiumSkillsBonus": {},
  "salaryFactors": [],
  "negotiationTarget": 0,
  "walkAwayPoint": 0,
  "companySizeAdjustment": { "startup": "", "midsize": "", "enterprise": "" },
  "tipsByLocation": "string",
  "redFlags": []
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, salary: result });
  } catch (err) {
    next(err);
  }
};

exports.salaryScript = async (req, res, next) => {
  try {
    const { offeredSalary, targetSalary, role, company } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!offeredSalary || !targetSalary) {
      return res.status(400).json({ success: false, message: 'offeredSalary and targetSalary are required.' });
    }

    const prompt = `Generate 3 salary negotiation scripts for:
Role: ${role || 'Software Engineer'}${company ? ` at ${company}` : ''}
Offered salary: ${offeredSalary}
Target salary: ${targetSalary}

GOLDEN RULE for call script: After stating your number — STOP TALKING. Let them respond.
Never apologize. State market data. Be specific about number.
Also include: ${role} red flags to watch for in offer letters.

Return ONLY valid JSON:
{
  "scripts": {
    "email": "string (formal email counter-offer)",
    "call": "string (phone/video talking points with pause notes)",
    "counter": "string (if they say no — ask for alternatives: signing bonus/PTO/remote)"
  },
  "redFlags": [],
  "offerLetterChecklist": [],
  "tipsForSuccess": []
}
Language: ${language}`;

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, negotiation: result });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMPANY-WISE INTERVIEW PREPARATION
// POST /api/career/company-prep
// ─────────────────────────────────────────────────────────────────────────────
exports.companyPrep = async (req, res, next) => {
  try {
    const { company, role } = req.body;
    const { language } = await getUserLanguage(req.user.id);

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'company and role are required.' });
    }

    const serviceCompanies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'HCL', 'Tech Mahindra', 'Cognizant'];
    const productCompanies = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix'];
    const consultingCompanies = ['Deloitte', 'McKinsey', 'BCG', 'Accenture', 'PwC', 'EY'];

    const tier = productCompanies.includes(company) ? 'product' :
                 consultingCompanies.includes(company) ? 'consulting' : 'service';

    let prompt = '';

    if (tier === 'service') {
      prompt = `Generate complete ${company} interview guide for ${role}.
Language: ${language}

For this service company, include details on:
1. Written test pattern: sections, duration, difficulty, and cut-off strategy.
2. Aptitude: quant topics (% / profit / time-speed), verbal, and reasoning focus.
3. Coding round: languages allowed, and typical array or string manipulation questions.
4. Technical Round (TR): top 30 questions for ${role} at ${company}.
5. Managerial Round (MR): top behavioral questions they always ask.
6. HR Round: offer-stage questions and common rejection reasons.
7. Tips on dress code, required documents, and reporting time rules.

Return ONLY valid JSON:
{
  "company": "${company}",
  "tier": "service",
  "writtenTest": { "sections": [], "duration": "string", "cutoffStrategy": "string" },
  "aptitudeFocus": { "quant": [], "verbal": [], "reasoning": [] },
  "codingRound": { "languages": [], "typicalQuestions": [], "tips": [] },
  "technicalQuestions": [],
  "managerialQuestions": [],
  "hrQuestions": [],
  "dressCode": "string",
  "documents": [],
  "salaryRange": "string",
  "tips": []
}
Language: ${language}`;
    } else {
      const companyFramework = company === 'Amazon' ? 'Amazon 16 Leadership Principles — STAR answers' :
                               company === 'Google' ? 'Google Googliness criteria + structured data approach' :
                               company === 'Microsoft' ? 'Microsoft Growth mindset questions + Azure comfort' :
                               company === 'Deloitte' ? 'Deloitte Consulting case approach + analytical frameworks' :
                               'standard product/consulting frameworks';

      prompt = `Generate complete ${company} interview guide for ${role}.
Language: ${language}
Specific Framework: ${companyFramework}

Include details on:
1. Process: rounds count, formats (phone/onsite/virtual), and timeline.
2. DSA: complexity expected, question types, and timing constraints.
3. System Design: complexity level, common topics, and scaling strategies.
4. Behavioral Framework: matching the exact rules for ${companyFramework}.
5. Compensation structure: typical base, RSUs, bonus, and refresh patterns.
6. Red flags to avoid specifically during the ${company} rounds.

Return ONLY valid JSON:
{
  "company": "${company}",
  "tier": "${tier}",
  "process": { "rounds": 0, "formats": [], "timeline": "string" },
  "dsaRound": { "complexity": "string", "questionTypes": [], "timePerQuestion": "string" },
  "systemDesignRound": { "complexity": "string", "commonTopics": [], "tips": [] },
  "behavioralFramework": { "name": "string", "principles": [], "starExamples": [] },
  "compensation": { "base": "string", "rsu": "string", "bonus": "string", "refreshPattern": "string" },
  "redFlags": [],
  "tips": []
}`;
    }

    const result = await callGemini(prompt);
    res.status(200).json({ success: true, company, tier, guide: result });
  } catch (err) {
    next(err);
  }
};
