const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error('Error caught in global handler:', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred on the server.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};