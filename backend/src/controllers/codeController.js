/**
 * codeController.js — Engine 37
 */
const codingService = require('../services/codingService');
const UserPreference = require('../models/UserPreference');

async function getLang(userId) {
  const p = await UserPreference.findOne({ userId }).select('language').lean();
  return p?.language || 'English';
}

exports.generateCode = async (req, res, next) => {
  try {
    const { description, language, framework, requirements } = req.body;
    if (!description || !language) return res.status(400).json({ success: false, message: 'description and language are required.' });
    const result = await codingService.generateCode({ description, language, framework, requirements });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.debugCode = async (req, res, next) => {
  try {
    const { code, language, errorMessage, context } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.debugCode({ code, language, errorMessage, context });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.reviewCode = async (req, res, next) => {
  try {
    const { code, language, reviewType } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.reviewCode({ code, language, reviewType });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.optimizeCode = async (req, res, next) => {
  try {
    const { code, language, optimizationGoal } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.optimizeCode({ code, language, optimizationGoal });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.generateTests = async (req, res, next) => {
  try {
    const { code, language, testFramework, coverageLevel } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.generateTests({ code, language, testFramework, coverageLevel });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.generateDocs = async (req, res, next) => {
  try {
    const { code, language, docStyle } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.generateDocumentation({ code, language, docStyle });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.explainCode = async (req, res, next) => {
  try {
    const { code, language, level } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const lang = await getLang(req.user.id);
    const result = await codingService.explainCode({ code, language, level, language: lang });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.securityReview = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) return res.status(400).json({ success: false, message: 'code and language are required.' });
    const result = await codingService.securityReview({ code, language });
    res.status(200).json({ success: true, ...result });
  } catch (err) { next(err); }
};

exports.getSupportedLanguages = (req, res) => {
  res.status(200).json({ success: true, languages: codingService.SUPPORTED_LANGUAGES });
};
