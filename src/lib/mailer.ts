import nodemailer from "nodemailer";

// Gmail SMTP transporter using an app password (not your real Google password).
// Requires 2-Step Verification + an app password generated at
// https://myaccount.google.com/apppasswords
export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});