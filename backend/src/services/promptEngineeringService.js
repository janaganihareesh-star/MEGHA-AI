/**
 * promptEngineeringService.js — Engine 40
 * Generate, optimize, debug prompts for ChatGPT, Gemini, Claude, Midjourney, etc.
 */

const axios = require('axios');

const AI_SYSTEMS = {
  chatgpt:  { type: 'llm',   promptStyle: 'conversational, role-based, task-specific' },
  gemini:   { type: 'llm',   promptStyle: 'structured, context-rich, task-focused' },
  claude:   { type: 'llm',   promptStyle: 'clear instructions, thinking aloud, examples' },
  cursor:   { type: 'code',  promptStyle: 'precise, context-heavy, file paths specified' },
  bolt:     { type: 'code',  promptStyle: 'detailed fullstack specs, component-level' },
  lovable:  { type: 'ui',    promptStyle: 'visual descriptions, design system, user flow' },
  midjourney: { type: 'image', promptStyle: 'subject + style + lighting + quality modifiers' },
  flux:     { type: 'image', promptStyle: 'detailed scene, artistic style, technical params' },
  stablediffusion: { type: 'image', promptStyle: 'positive/negative prompts, CFG scale, steps' },
  dalle:    { type: 'image', promptStyle: 'descriptive, artistic medium, composition details' }
};

const TEMPLATES = {
  codeGeneration: {
    name: 'Code Generation',
    emoji: '💻',
    template: 'Build a [FEATURE] in [LANGUAGE] using [FRAMEWORK].\n\nRequirements:\n- [REQUIREMENT_1]\n- [REQUIREMENT_2]\n\nConstraints:\n- Follow [BEST_PRACTICE]\n- Include error handling\n- Add comments\n\nOutput: Complete, runnable code with explanation.'
  },
  imagePortrait: {
    name: 'Portrait Photography',
    emoji: '📸',
    template: 'Portrait of [SUBJECT], [EXPRESSION], [LIGHTING_TYPE] lighting, [BACKGROUND], professional photography, Canon 5D, 85mm lens, bokeh, hyperrealistic, 4K, award-winning'
  },
  systemPrompt: {
    name: 'System Prompt (AI Persona)',
    emoji: '🤖',
    template: 'You are [NAME], a [ROLE/DESCRIPTION]. Your purpose is to [GOAL].\n\nBehavior rules:\n1. Always [BEHAVIOR_1]\n2. Never [BEHAVIOR_2]\n3. When asked [SCENARIO], respond with [RESPONSE_STYLE]\n\nTone: [TONE]. Language: [LANGUAGE].'
  },
  dataAnalysis: {
    name: 'Data Analysis',
    emoji: '📊',
    template: 'Analyze this [DATA_TYPE] data:\n[DATA]\n\nProvide:\n1. Summary statistics\n2. Key trends\n3. Anomalies/outliers\n4. Business insights\n5. Recommendations\n\nFormat: Clear headings, bullet points, tables where applicable.'
  },
  storyWriting: {
    name: 'Creative Story',
    emoji: '📖',
    template: 'Write a [GENRE] story about [CHARACTER] who [SITUATION].\n\nSetting: [PLACE and TIME]\nConflict: [MAIN_CONFLICT]\nTone: [TONE]\nLength: [WORD_COUNT] words\nStyle: [WRITING_STYLE like Hemingway/modern/lyrical]'
  },
  uiDesign: {
    name: 'UI Component (Lovable/Bolt)',
    emoji: '🎨',
    template: 'Create a [COMPONENT_NAME] React component.\n\nDesign:\n- Color scheme: [COLORS]\n- Style: [GLASSMORPHISM/DARK/MINIMAL]\n- Animations: subtle micro-interactions\n\nFeatures:\n- [FEATURE_1]\n- [FEATURE_2]\n\nTech: React + Tailwind CSS. Mobile responsive.'
  }
};

async function callGemini(prompt, maxTokens = 1024) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'AIzaSyDummyKeyForGeminiAPI') {
    return { mock: true };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
  const res = await axios.post(url, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens, responseMimeType: 'application/json' }
  });
  const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  try { return JSON.parse(text); }
  catch { return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim()); }
}

async function generatePrompt({ goal, targetAI, type, language = 'English', style = '' }) {
  const aiInfo = AI_SYSTEMS[targetAI?.toLowerCase()] || AI_SYSTEMS.chatgpt;
  const promptStyle = aiInfo.promptStyle;

  const engineGuides = {
    llm: `- Use role assignment: "You are a..."
- Add constraints: "Always/Never/Only..."
- Specify format: "Return as JSON/bullet points/table"
- Include examples if complex (few-shot)
- Set context and constraints upfront`,
    code: `- Specify exact stack/language/version
- Describe file structure if relevant
- List all features with edge cases
- State what NOT to include
- Ask for explanation alongside code`,
    image: `- Subject first, then modifiers
- Style: photorealistic/illustration/oil painting
- Lighting: golden hour/studio/dramatic
- Quality tags: 4K, masterpiece, highly detailed
- Camera/lens specs if photo-style
- Negative prompt (what to avoid)`
  };

  const prompt = `Generate an optimized prompt for ${targetAI} AI.
Goal: ${goal}
AI Type: ${aiInfo.type} (${promptStyle})
Output style: ${style || 'standard'}
Language: ${language}

Prompt Engineering Rules:
${engineGuides[aiInfo.type]}

Return JSON:
{
  "generatedPrompt": "string (the complete, ready-to-use prompt)",
  "targetAI": "${targetAI}",
  "type": "${aiInfo.type}",
  "promptStructure": [{"section":"","content":"","reason":""}],
  "keyTechniques": [],
  "negativePrompt": "string or null (for image generators)",
  "alternatives": ["string", "string"],
  "qualityTips": []
}`;
  return callGemini(prompt, 1500);
}

async function optimizePrompt({ existingPrompt, targetAI, goal, language = 'English' }) {
  const aiInfo = AI_SYSTEMS[targetAI?.toLowerCase()] || AI_SYSTEMS.chatgpt;

  const prompt = `Optimize this ${targetAI} prompt to get better results.
Original prompt: "${existingPrompt}"
Goal: ${goal || 'better, more accurate results'}
Language: ${language}

Return JSON:
{
  "originalPrompt": "${existingPrompt.replace(/"/g, '\\"').substring(0, 500)}",
  "optimizedPrompt": "string (improved version)",
  "improvements": [{"what":"","why":"","impact":""}],
  "scoreOriginal": 0,
  "scoreOptimized": 0,
  "techniqueUsed": [],
  "side_by_side": {"original": "string", "improved": "string"}
}`;
  return callGemini(prompt, 1500);
}

async function debugPrompt({ prompt: userPrompt, targetAI, problem, expectedOutput, actualOutput }) {
  const prompt = `Debug this ${targetAI} prompt that isn't working as expected.
Prompt: "${userPrompt}"
Problem: ${problem || 'Not getting expected output'}
Expected: ${expectedOutput || ''}
Actual: ${actualOutput || ''}

Return JSON:
{
  "diagnosis": "string (what's wrong)",
  "issues": [{"issue":"","severity":"high|medium|low","fix":""}],
  "debuggedPrompt": "string (corrected prompt)",
  "rootCause": "string",
  "preventionTips": [],
  "alternativeApproaches": []
}`;
  return callGemini(prompt, 1024);
}

async function getTemplates() {
  return {
    templates: Object.entries(TEMPLATES).map(([key, t]) => ({ key, ...t })),
    aiSystems: Object.keys(AI_SYSTEMS)
  };
}

module.exports = {
  generatePrompt,
  optimizePrompt,
  debugPrompt,
  getTemplates,
  AI_SYSTEMS,
  TEMPLATES
};
