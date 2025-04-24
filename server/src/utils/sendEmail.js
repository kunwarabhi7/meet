import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Error verifying email transporter:", error);
  } else {
    console.log("Email transporter is ready to send emails.");
  }
});

export const sendEmail = async (to, subject, html) => {
  try {
    //validate email address
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email configuration is missing.");
    }

    const info = await transporter.sendMail({
      from: `"Event Scheduler " <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(
      "Email sent successfully to:",
      to,
      "Message ID:",
      info.messageId
    );
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};
