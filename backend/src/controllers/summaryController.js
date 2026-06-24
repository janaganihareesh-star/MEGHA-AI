const ConversationSummary = require('../models/ConversationSummary');
const summaryService = require('../services/summaryService');

// GET /api/summary
exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const summaries = await ConversationSummary.find({ userId }).sort({ year: -1, month: -1 });
    res.status(200).json({ success: true, summaries });
  } catch (err) {
    next(err);
  }
};

// POST /api/summary/generate
exports.generateMonthlySummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.body;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: 'Month and Year parameters are required.' });
    }

    const summary = await summaryService.generateSummary({ userId, month: parseInt(month), year: parseInt(year) });
    if (!summary) {
      return res.status(400).json({
        success: false,
        message: 'Could not generate summary. Ensure you have messages logged during this month.'
      });
    }

    res.status(200).json({ success: true, summary });
  } catch (err) {
    next(err);
  }
};