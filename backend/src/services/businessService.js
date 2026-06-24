/**
 * businessService.js — Engine 46
 * Business Engine: startup ideas, business plans, pitch decks, marketing, SWOT
 */

const axios = require('axios');

async function callGemini(prompt, maxTokens = 2048) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') return { mock: true };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function generateStartupIdeas({ domain, budget, targetMarket, skills, language = 'English' }) {
  const prompt = `Generate 5 innovative startup ideas.
Domain/Interest: ${domain || 'tech'} | Budget: ${budget || 'bootstrap'} | Market: ${targetMarket || 'India'} | Skills: ${skills || ''}
Language: ${language}

Each idea should: solve a real problem, have clear monetization, be achievable with given budget.

Return JSON:
{
  "ideas": [
    {
      "name": "string",
      "tagline": "string",
      "problem": "string",
      "solution": "string",
      "targetUsers": "string",
      "revenueModel": "string",
      "estimatedCost": "string",
      "timeline": "string",
      "marketSize": "string",
      "competitors": [],
      "uniqueAdvantage": "string",
      "riskLevel": "low|medium|high",
      "techRequired": []
    }
  ]
}`;
  return callGemini(prompt, 2048);
}

async function generateBusinessPlan({ businessName, idea, targetMarket, budget, timeline = '1 year', language = 'English' }) {
  const prompt = `Create a comprehensive business plan for: "${businessName}"
Idea: ${idea} | Market: ${targetMarket} | Budget: ${budget} | Timeline: ${timeline} | Language: ${language}

Return JSON:
{
  "executiveSummary": "string",
  "businessDescription": "string",
  "marketAnalysis": {
    "marketSize": "string",
    "targetSegment": "string",
    "trends": [],
    "opportunities": []
  },
  "competitorAnalysis": [{"name":"","strengths":"","weaknesses":""}],
  "swotAnalysis": {"strengths":[],"weaknesses":[],"opportunities":[],"threats":[]},
  "productsServices": [{"name":"","description":"","price":""}],
  "revenueModel": {"streams":[],"projections":[]},
  "marketingPlan": {"channels":[],"budget":"","strategy":""},
  "operationalPlan": {"teamSize":"","location":"","processes":[]},
  "financialPlan": {"initialInvestment":"","breakEvenPoint":"","year1Revenue":"","year2Revenue":""},
  "milestones": [{"month":"","goal":""}],
  "risks": [{"risk":"","mitigation":""}],
  "formattedText": "string (complete business plan)"
}`;
  return callGemini(prompt, 3000);
}

async function generatePitchDeck({ businessName, idea, askAmount, stage, language = 'English' }) {
  const prompt = `Create pitch deck content for: "${businessName}"
Idea: ${idea} | Asking: ${askAmount || '$500K'} | Stage: ${stage || 'pre-seed'} | Language: ${language}

Return JSON:
{
  "slides": [
    {
      "slideNumber": 1,
      "title": "string",
      "type": "problem|solution|market|product|traction|team|business_model|competition|financials|ask",
      "content": "string",
      "keyPoints": [],
      "dataPoints": [],
      "visualSuggestion": "string"
    }
  ],
  "pitchScript": "string (3-minute verbal pitch)",
  "elevatorPitch": "string (30-second version)",
  "keyMetrics": [],
  "investorQuestions": [{"question":"","answer":""}]
}`;
  return callGemini(prompt, 2048);
}

async function generateMarketingPlan({ businessName, product, targetAudience, budget, channels, language = 'English' }) {
  const prompt = `Create a digital marketing plan for "${businessName}".
Product: ${product} | Audience: ${targetAudience} | Budget: ${budget || '₹50,000/month'} | Channels: ${channels || 'all digital'}
Language: ${language}

Return JSON:
{
  "summary": "string",
  "targetPersona": {"name":"","age":"","interests":[],"painPoints":[]},
  "channels": [
    {"channel":"","budget":"","strategy":"","kpis":[],"contentIdeas":[]}
  ],
  "contentCalendar": [{"week":"","content":"","platform":""}],
  "funnelStrategy": {"awareness":"","consideration":"","conversion":"","retention":""},
  "kpis": [{"metric":"","target":"","tool":""}],
  "monthlyBudgetBreakdown": {},
  "quickWins": [],
  "longTermStrategy": "string"
}`;
  return callGemini(prompt, 2048);
}

async function competitorAnalysis({ businessName, competitors, industry, language = 'English' }) {
  const prompt = `Perform competitive analysis for "${businessName}" in ${industry}.
Competitors to analyze: ${Array.isArray(competitors) ? competitors.join(', ') : competitors}
Language: ${language}

Return JSON:
{
  "overview": "string",
  "competitorsMatrix": [
    {
      "name": "string",
      "strengths": [],
      "weaknesses": [],
      "pricing": "string",
      "targetMarket": "string",
      "marketShare": "string",
      "uniqueFeatures": []
    }
  ],
  "yourAdvantages": [],
  "gaps": [],
  "positioning": "string",
  "differentiationStrategy": "string",
  "recommendations": []
}`;
  return callGemini(prompt, 2048);
}

module.exports = {
  generateStartupIdeas,
  generateBusinessPlan,
  generatePitchDeck,
  generateMarketingPlan,
  competitorAnalysis
};
