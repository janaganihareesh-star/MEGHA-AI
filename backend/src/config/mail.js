const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  },
  tls: {
    rejectUnauthorized: false
  }
});

const verifySMTP = async () => {
  try {
    await transporter.verify();
    console.log('Gmail SMTP Connected');
    return true;
  } catch (err) {
    console.error(`Gmail SMTP Connection Failed: ${err.message}`);
    return false;
  }
};

module.exports = { transporter, verifySMTP };
