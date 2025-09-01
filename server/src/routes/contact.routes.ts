
import express from "express";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config();

const router = express.Router();

/**
 * POST /api/contact
 * Send contact email using SMTP. Make sure env vars are set:
 *  - SMTP_HOST (default smtp.gmail.com)
 *  - SMTP_PORT (default 587)
 *  - SMTP_USER
 *  - SMTP_PASS
 *  - CONTACT_RECEIVER (where to receive contact form emails)
 */
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER || "bibashchaudhary330@gmail.com";
  const pass = process.env.SMTP_PASS  || "twew tjuj shct eije";
  const receiver = process.env.CONTACT_RECEIVER || user;

  if (!user || !pass || !receiver) {
    console.error("Missing SMTP env vars (SMTP_USER/SMTP_PASS/CONTACT_RECEIVER)");
    return res.status(500).json({ error: "Mail server not configured" });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: email,
    to: receiver,
    subject: `Contact form message from ${name}`,
    html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong> ${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Contact message sent:", info.response);
    res.json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Error sending contact message:", err);
    res.status(500).json({ error: "Error sending message" });
  }
});

export default router;
