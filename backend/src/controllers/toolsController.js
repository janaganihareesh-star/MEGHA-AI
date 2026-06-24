/**
 * Unified controllers for Engines 39-46
 */

// ─── Engine 39: Translation ────────────────────────────────────────────────
const translationService = require('../services/translationService');
exports.translateText = async (req, res, next) => {
  try {
    const { text, targetLanguage, sourceLanguage, style, context } = req.body;
    if (!text || !targetLanguage) return res.status(400).json({ success: false, message: 'text and targetLanguage required.' });
    const result = await translationService.translateText({ text, targetLanguage, sourceLanguage, style, context });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.translateDocument = async (req, res, next) => {
  try {
    const { documentText, targetLanguage, sourceLanguage, preserveStructure } = req.body;
    if (!documentText || !targetLanguage) return res.status(400).json({ success: false, message: 'documentText and targetLanguage required.' });
    const result = await translationService.translateDocument({ documentText, targetLanguage, sourceLanguage, preserveStructure });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.translateChat = async (req, res, next) => {
  try {
    const { message, targetLanguage, conversationContext } = req.body;
    if (!message || !targetLanguage) return res.status(400).json({ success: false, message: 'message and targetLanguage required.' });
    const result = await translationService.translateChat({ message, targetLanguage, conversationContext });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.detectLanguage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'text required.' });
    const result = await translationService.detectLanguage({ text });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getLanguages = (req, res) => {
  res.status(200).json({ success: true, ...translationService.SUPPORTED_LANGUAGES });
};

// ─── Engine 40: Prompt Engineering ────────────────────────────────────────
const promptService = require('../services/promptEngineeringService');
exports.generatePrompt = async (req, res, next) => {
  try {
    const { goal, targetAI, type, style } = req.body;
    if (!goal || !targetAI) return res.status(400).json({ success: false, message: 'goal and targetAI required.' });
    const result = await promptService.generatePrompt({ goal, targetAI, type, style });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.optimizePrompt = async (req, res, next) => {
  try {
    const { existingPrompt, targetAI, goal } = req.body;
    if (!existingPrompt || !targetAI) return res.status(400).json({ success: false, message: 'existingPrompt and targetAI required.' });
    const result = await promptService.optimizePrompt({ existingPrompt, targetAI, goal });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.debugPrompt = async (req, res, next) => {
  try {
    const { prompt, targetAI, problem, expectedOutput, actualOutput } = req.body;
    if (!prompt || !targetAI) return res.status(400).json({ success: false, message: 'prompt and targetAI required.' });
    const result = await promptService.debugPrompt({ prompt, targetAI, problem, expectedOutput, actualOutput });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getPromptTemplates = async (req, res, next) => {
  try {
    const result = await promptService.getTemplates();
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ─── Engine 42: Content Creation ──────────────────────────────────────────
const contentService = require('../services/contentService');
exports.generateContent = async (req, res, next) => {
  try {
    const { type, options } = req.body;
    if (!type) return res.status(400).json({ success: false, message: 'content type required.' });
    const result = await contentService.generateContent({ type, options: options || {} });
    res.status(200).json({ success: true, contentType: type, ...result });
  } catch (err) { next(err); }
};
exports.seoOptimize = async (req, res, next) => {
  try {
    const { content, targetKeyword } = req.body;
    if (!content || !targetKeyword) return res.status(400).json({ success: false, message: 'content and targetKeyword required.' });
    const result = await contentService.seoOptimize({ content, targetKeyword });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ─── Engine 43: Academic ───────────────────────────────────────────────────
const academicService = require('../services/academicService');
exports.generateAssignment = async (req, res, next) => {
  try {
    const result = await academicService.generateAssignment(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.generateReport = async (req, res, next) => {
  try {
    const result = await academicService.generateReport(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.generatePPT = async (req, res, next) => {
  try {
    const result = await academicService.generatePPTContent(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.generateVivaQs = async (req, res, next) => {
  try {
    const result = await academicService.generateVivaQuestions(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.generateLabRecord = async (req, res, next) => {
  try {
    const result = await academicService.generateLabRecord(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ─── Engine 44: Calculation ────────────────────────────────────────────────
const calculationService = require('../services/calculationService');
exports.calculate = async (req, res, next) => {
  try {
    const { problem, type, showSteps } = req.body;
    if (!problem) return res.status(400).json({ success: false, message: 'problem is required.' });
    const result = await calculationService.solveProblem({ problem, type, showSteps });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.explainFormula = async (req, res, next) => {
  try {
    const { formula } = req.body;
    if (!formula) return res.status(400).json({ success: false, message: 'formula is required.' });
    const result = await calculationService.explainFormula({ formula });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.practiceProblems = async (req, res, next) => {
  try {
    const result = await calculationService.generatePracticeProblems(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ─── Engine 45: Official Drafts ────────────────────────────────────────────
const officialDraftService = require('../services/officialDraftService');
exports.generateDraft = async (req, res, next) => {
  try {
    const { type, details } = req.body;
    if (!type) return res.status(400).json({ success: false, message: 'draft type is required.' });
    const result = await officialDraftService.generateDraft({ type, details: details || {} });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getDraftTypes = async (req, res, next) => {
  try {
    const result = await officialDraftService.getDraftTypes();
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

// ─── Engine 46: Business ───────────────────────────────────────────────────
const businessService = require('../services/businessService');
exports.getStartupIdeas = async (req, res, next) => {
  try {
    const result = await businessService.generateStartupIdeas(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getBusinessPlan = async (req, res, next) => {
  try {
    const { businessName, idea, targetMarket, budget } = req.body;
    if (!businessName || !idea) return res.status(400).json({ success: false, message: 'businessName and idea required.' });
    const result = await businessService.generateBusinessPlan(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getPitchDeck = async (req, res, next) => {
  try {
    const result = await businessService.generatePitchDeck(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getMarketingPlan = async (req, res, next) => {
  try {
    const result = await businessService.generateMarketingPlan(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
exports.getCompetitorAnalysis = async (req, res, next) => {
  try {
    const result = await businessService.competitorAnalysis(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};
