require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const axios = require("axios");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer setup for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to generate email content using Gemini API
const generateEmailContent = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  try {
    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      { timeout: 10000 }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(
      "Error fetching from Gemini API:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to generate content: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

// Endpoint to generate email with Gemini
app.post("/api/generate-email", async (req, res) => {
  const emaildata = req.body;
  if (!emaildata || emaildata.length === 0) {
    return res.status(400).json({ message: "No email data provided." });
  }
  try {
    const prompt = `Write a formal email to ${emaildata.recipientname} and email ${emaildata.recipientEmail} from ${emaildata.name} and ${emaildata.email} subject ${emaildata.subject} given the content: ${emaildata.content}`;
    const emailText = await generateEmailContent(prompt);
    res.json({ generatedEmail: emailText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error generating invitations." });
  }
});

// Endpoint to send email (with attachments)
app.post("/api/send-email", upload.single("attachment"), async (req, res) => {
  const { recieverEmail, content, subject, useremail, userpasscode } = req.body;
  console.log(req.body);

  if (!recieverEmail || !content) {
    return res.status(400).json({ message: "Email and content are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: useremail,
        pass: userpasscode,
      },
    });

    const mailOptions = {
      from: useremail,
      to: recieverEmail,
      subject: subject,
      text: content,
      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              content: req.file.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: `Email sent to ${recieverEmail}` });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error sending email." });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
