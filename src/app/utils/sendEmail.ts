import nodemailer from "nodemailer";

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "devlopersolaiman@gmail.com",
      pass: "zwwl jklb kveb fpzy",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password Reset - Travel Guides",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
    <h2 style="color: #0073e6; text-align: center;">Travel Guides</h2>
    <h3 style="color: #333333;">Reset Your Password</h3>
    <p style="color: #333333; font-size: 16px;">
      Hi there,
    </p>
    <p style="color: #333333; font-size: 16px;">
      We received a request to reset the password associated with your account. If you didn't request a password reset, please ignore this email.
    </p>
    <p style="color: #333333; font-size: 16px;">
      To reset your password, please click the button below:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetLink}" style="background-color: #0073e6; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
    </div>
    <p style="color: #333333; font-size: 16px;">
      Alternatively, you can copy and paste the following link into your browser:
    </p>
    <p style="color: #0073e6; font-size: 16px; word-wrap: break-word;">
      ${resetLink}
    </p>
    <p style="color: #333333; font-size: 16px;">
      Thanks,<br/>
      The Guides Team
    </p>
    <hr style="border: 0; border-top: 1px solid #dddddd;">
    <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
      If you have any issues, please contact us at devlopersolaiman@gmail.com.<br/>
      © 2025 Travel Guides. All rights reserved.
    </p>
  </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
