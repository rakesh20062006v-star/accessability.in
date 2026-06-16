
const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'rakeshcompany2006@gmail.com',
    pass: 'lqvm isyt qlbm cnux',
  },
});

// Common mail sender
const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: 'rakeshcompany2006@gmail.com',
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
    <h2>Welcome ${username} 🎉</h2>
    <p>Your account has been registered successfully.</p>
    <p>Thank you for joining us.</p>
  `;

  await sendMail(email, "Registration Successful", html);
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