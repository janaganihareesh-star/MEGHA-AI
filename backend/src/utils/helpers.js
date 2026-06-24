const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const formatResponse = (success, message, data = {}) => {
  return {
    success,
    message,
    ...data
  };
};

module.exports = {
  generateOtp,
  formatResponse
};