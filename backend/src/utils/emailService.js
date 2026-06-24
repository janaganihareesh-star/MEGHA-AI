const { transporter } = require('../config/mail');

/**
 * Sends an OTP for email verification or password reset.
 */
const sendEmailOTP = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes('mock_email')) {
    console.log(`[DEV MODE - NODEMAILER NOT CONFIGURED] Email OTP code for ${email} is: ${otp}`);
    return;
  }
  const mailOptions = {
    from: `"MEGHA AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'MEGHA AI - Email Verification Code',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 450px; margin: auto; padding: 20px; border-radius: 12px; background: #0D0D1A; color: #EEF0FF; border: 1px solid #2A2A5A;">
        <h2 style="color: #A78BFA; text-align: center;">Verify your MEGHA AI Account</h2>
        <p style="font-size: 14px; color: #A0A8D0;">Hi, use the OTP code below to verify your email. The code is active for 10 minutes:</p>
        <div style="font-size: 28px; font-weight: bold; text-align: center; letter-spacing: 4px; color: #EEF0FF; padding: 12px; margin: 20px 0; background: #13132B; border-radius: 8px; border: 1px solid #2A2A5A;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #A0A8D0; text-align: center;">If you did not make this request, please ignore this email.</p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send Email OTP:', err.message);
    console.log(`[FALLBACK] Email OTP code for ${email} is: ${otp}`);
  }
};

/**
 * Sends an emergency alert email to trusted contacts.
 */
const sendEmergencyAlertEmail = async (contactEmail, contactName, userName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER.includes('mock_email')) {
    console.log(`[DEV MODE] Emergency Alert to ${contactEmail} triggered for user ${userName}`);
    return;
  }
  const mailOptions = {
    from: `"MEGHA AI SAFETY" <${process.env.EMAIL_USER}>`,
    to: contactEmail,
    subject: `🚨 URGENT: Safety Alert for ${userName}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 450px; margin: auto; padding: 20px; border-radius: 12px; background: #2A0A10; color: #FFE0E0; border: 1px solid #FF4444;">
        <h2 style="color: #FF6666; text-align: center;">⚠️ URGENT: Safety Alert from MEGHA AI</h2>
        <p style="font-size: 14px;">Hello ${contactName || 'Trusted Friend'},</p>
        <p style="font-size: 14px; color: #FFB3B3; line-height: 1.6;">
          We are <strong>MEGHA AI</strong>, an AI companion app that your friend <strong>${userName}</strong> has been chatting with. 
          They have listed you as their emergency trusted contact.
        </p>
        <p style="font-size: 14px; color: #FFB3B3; line-height: 1.6;">
          We are reaching out to you because ${userName} seems to be going through a very tough time right now. During our recent conversations, they expressed feelings of severe emotional distress or a potential emergency. Despite our efforts to comfort them, they are consistently showing signs of vulnerability.
        </p>
        <p style="font-size: 14px; font-weight: bold; background: #4A1111; padding: 15px; border-radius: 8px; line-height: 1.6;">
          As an AI, there is only so much we can do. Please call or reach out to ${userName} immediately and check on them. Sometimes, just hearing a friend's voice can make all the difference. Please take care of them.
        </p>
        <p style="font-size: 12px; color: #AA7777; text-align: center; margin-top: 20px;">
          This is an automated safety mechanism from MEGHA AI. Do not reply to this email.
        </p>
      </div>
    `
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`[SAFETY] Dispatched emergency email to ${contactEmail}`);
  } catch (err) {
    console.error(`[SAFETY ERROR] Failed to send emergency email to ${contactEmail}:`, err.message);
  }
};

module.exports = {
  sendEmailOTP,
  sendEmergencyAlertEmail
};
