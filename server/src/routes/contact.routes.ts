import express from "express";
import dotenv from "dotenv";
import { createTransport } from "../utils/mail";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  // Check env vars
  const receiver = process.env.CONTACT_RECEIVER;
  if (!receiver) {
    console.error("Missing CONTACT_RECEIVER env var");
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
