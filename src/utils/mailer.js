const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.EMAIL_PASSWORD, 
  },
});

const sendResetEmail = async (to, resetToken) => {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Blissme App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password – Blissme",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Blissme Password Reset</h2>
        <p>Hi there,</p>
        <p>You recently requested to reset your Blissme account password.</p>
        <p>Click the button below to reset it:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>If the button doesn’t work, you can also use this link:</p>
        <p><a href="${resetUrl}" style="color: #4CAF50;">${resetUrl}</a></p>
        <p><strong>This link will expire in 15 minutes.</strong></p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999;">
          If you didn’t request this, you can safely ignore this email – your password won’t change.
        </p>
        <p style="font-size: 12px; color: #999;">– The Blissme Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = { sendResetEmail };
