import express from "express";
import dotenv from "dotenv";
import { createTransport } from "../utils/mail";

dotenv.config();

const router = express.Router();

console.log("receiver: ", process.env.CONTACT_RECEIVER);

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  const receiver = process.env.CONTACT_RECEIVER;

  // Check env vars
if (!process.env.CONTACT_RECEIVER || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
  console.error("Mail server not configured. Missing:", {
    CONTACT_RECEIVER: receiver,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASSWORD ? "set" : "missing",
  });
  return res.status(500).json({ error: "Mail server not configured" });
}


  try {
    const transporter = createTransport();

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // sender address
      to: receiver,
      subject: `Contact form message from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Contact message sent:", info.response);
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending contact message:", err);
    res.status(500).json({ error: "Error sending message" });
  }
});

export default router;
