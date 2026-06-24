const safetyService = require('../services/safetyService');

module.exports = async (req, res, next) => {
  try {
    const text = req.body.message || req.body.transcript;
    if (text) {
      const safetyResult = await safetyService.checkSafetyTriggers(text);
      if (safetyResult && safetyResult.action === 'block') {
        return res.status(400).json({
          success: false,
          message: safetyResult.reply || 'Your message violates safety guidelines.',
          safetyAlert: true
        });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};