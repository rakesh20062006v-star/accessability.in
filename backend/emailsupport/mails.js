
const nodemailer = require("nodemailer");

// Configure transporter
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Common mail sender
const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER ,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

// Registration Success Mail
const sendRegistrationMail = async (email, username) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9fafb; border-radius: 12px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899); padding: 40px 30px; text-align: center;">
        <div style="font-size: 60px; margin-bottom: 12px;">♿</div>
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to AccessAbility!</h1>
        <p style="color: rgba(255,255,255,0.85); margin-top: 8px; font-size: 15px;">Your account has been created successfully</p>
      </div>

      <!-- Body -->
      <div style="padding: 36px 30px;">
        <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 12px;">Hello, ${username}! 🎉</h2>
        <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          We're thrilled to have you on board. Your account is now active and ready to use.
          Explore personalized accessibility services, job opportunities, and support resources tailored for you.
        </p>

        <div style="background: #ede9fe; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="color: #5b21b6; font-size: 14px; margin: 0; font-weight: 600;">🔐 Keep your credentials safe</p>
          <p style="color: #6d28d9; font-size: 13px; margin: 6px 0 0;">Never share your password with anyone. Our team will never ask for it.</p>
        </div>

        <p style="color: #4b5563; font-size: 14px; line-height: 1.7;">
          If you have any questions or need assistance, feel free to reach out to our support team.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f3f4f6; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} AccessAbility Portal. All rights reserved.</p>
        <p style="color: #9ca3af; font-size: 12px; margin: 4px 0 0;">You received this email because you registered on our platform.</p>
      </div>
    </div>
  `;

  await sendMail(email, "🎉 Welcome to AccessAbility — Registration Successful!", html);
};

// Forgot Password Mail

    const sendForgotPasswordMail = async (email, otp) => {
      
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Password Reset Request</h2>

      <p>We received a request to reset your password.</p>

      <p>Use the OTP below to verify your identity:</p>

      <div style="
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          margin: 20px 0;
      ">
        <h1 style="
            color: #2563eb;
            letter-spacing: 8px;
            margin: 0;
        ">
          ${otp}
        </h1>
      </div>

      <p>This OTP is valid for <strong>15 minutes</strong>.</p>

      <p>If you did not request a password reset, please ignore this email.</p>

      <br>

      <p>Regards,</p>
      <p><strong>Accessibility Portal Team</strong></p>
    </div>
  `;

  await sendMail(email, "Password Reset OTP", html);
};
 


// Job Details Mail
const sendJobDetailsMail = async (email, job) => {
  const html = `
    <h2>Job Opportunity</h2>

    <p><strong>Title:</strong> ${job.title}</p>
    <p><strong>Company:</strong> ${job.company}</p>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Type:</strong> ${job.type}</p>
    <p><strong>salary:</strong> ${job.salary}</p>
    <p><string>send your Resume for the given email ${job.email} </strong></p>
    <p>if you have any quries related to jobs please sent your queies through the given email</p>
    <h3>THANKING YOU FOR USE MY PLATFORM <h3>
    <h3>WISHE FOR YOUR SUCCESSFULL CARRER<h3>
    <hr>

    <p>${job.description}</p>
  `;

  await sendMail(email, `Job Opening - ${job.title}`, html);
};

// Application Status Mail
const sendApplicationStatusMail = async (
  email,
  username,
  status,
  jobTitle
) => {
  const html = `
    <h2>Hello ${username}</h2>

    <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>

    <p>
      Status:
      <strong>${status}</strong>
    </p>

    <p>Thank you for using our platform.</p>
  `;

  await sendMail(email, "Application Status Update", html);
};

// Export all functions
module.exports = {
  sendRegistrationMail,
  sendForgotPasswordMail,
  sendJobDetailsMail,
  sendApplicationStatusMail,
};