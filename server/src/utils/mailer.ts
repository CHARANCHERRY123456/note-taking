import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn("Email environment variables not set. OTP emails will fail if used.");
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const from = process.env.EMAIL_USER!;
  const subject = "Your OTP for Notes App";
  const text = `Your OTP is ${otp}. It expires in 5 minutes. If you didn't request this, ignore.`;
  const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`;

  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}
