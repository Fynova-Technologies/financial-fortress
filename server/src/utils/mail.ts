import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

export function createTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!user || !pass) {
    throw new Error("SMTP Error occuer missing user and password");
  }

  const options: SMTPTransport.Options = {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };

  return nodemailer.createTransport(options);
}
