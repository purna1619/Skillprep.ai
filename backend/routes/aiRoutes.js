import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OpenAI from "openai";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

/* ================= AUTH MIDDLEWARE ================= */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/* ================= GENERATE MCQS ================= */
router.post("/generate-mcqs", (req, res) => {
  const { notes } = req.body;

  if (!notes) {
    return res.status(400).json({ message: "Notes required" });
  }

  // Split into sentences
  const sentences = notes
    .split(/[.?!]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return res.status(400).json({ message: "Not enough content" });
  }

  // Create MCQs dynamically
  const mcqs = sentences.map((sentence, index) => {
    const words = sentence.split(" ").filter(Boolean);

    const options = [
      words[0] || "Concept",
      words[1] || "Data",
      words[2] || "System",
      words[3] || "Process",
    ];

    return {
      question: `Q${index + 1}. Which keyword relates to: "${sentence.slice(0, 45)}..."`,
      options,
      answer: options[0],
    };
  });

  res.json(mcqs);
});

/* ================= SAVE SCORE ================= */
router.post("/save-score", authMiddleware, async (req, res) => {
  try {
    const { score, total } = req.body;

    if (score == null || total == null) {
      return res.status(400).json({ message: "Score data missing" });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.scores.push({
      score,
      total,
      date: new Date(),
    });

    await user.save();

    res.json({ message: "Score saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save score" });
  }
});

/* ================= GET PROFILE ================= */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

export default router;
/* ================= UPLOAD & PARSE RESUME ================= */
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const data = await pdf(req.file.buffer);
    if (!data || !data.text) {
      throw new Error("PDF parsing returned empty content");
    }
    res.json({ text: data.text });
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    res.status(500).json({ message: "Failed to parse resume: " + err.message });
  }
});

/* ================= INTERVIEW CHAT (REAL-TIME) ================= */
router.post("/interview-chat", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "OpenAI API Key is missing on server" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { role, history, resumeText } = req.body;

  if (!role || !history) {
    return res.status(400).json({ message: "Role and history required" });
  }

  try {
    const systemPrompt = `You are a professional technical interviewer for a ${role} position. 
    ${resumeText ? `Use the following candidate resume for context but do not mention you have it explicitly: \n${resumeText}` : ""}
    Assess the candidate's skills by asking one question at a time.
    Keep your questions and feedback extremely concise (under 25 words) for rapid response.
    Be encouraging but professional.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Reverting to gpt-3.5-turbo for stability first, will optimize later
      messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ message: "Failed to generate response: " + err.message });
  }
});

/* ================= INTERVIEW QUESTIONS (STATIC - LEGACY) ================= */
router.post("/interview-questions", (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ message: "Role required" });
  }

  const baseQuestions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want this role?",
    "Explain a challenging project you worked on.",
    "How do you handle deadlines?",
  ];

  const roleQuestions = {
    developer: [
      "Explain OOP concepts.",
      "What is REST API?",
      "Difference between SQL and NoSQL?",
      "Explain async programming.",
      "What is React lifecycle?",
    ],
    ai: [
      "What is machine learning?",
      "Explain overfitting vs underfitting.",
      "What is gradient descent?",
      "Difference between CNN and RNN?",
      "What is feature engineering?",
    ],
  };

  const questions = [
    ...baseQuestions,
    ...(roleQuestions[role.toLowerCase()] || []),
  ];

  res.json(questions);
});

/* ================= GET INTERVIEW REVIEW ================= */
router.post("/get-interview-review", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: "OpenAI API Key is missing" });
  }

  const { history, role } = req.body;

  if (!history || history.length === 0) {
    return res.status(400).json({ message: "No history to review" });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const prompt = `You are an expert technical interviewer. Review the following interview transcript for a ${role} position and provide a constructive summary.
    
    Transcript:
    ${history.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n')}
    
    Provide your response in JSON format (strictly JSON) with the following structure:
    {
      "mistakes": ["List specific technical or communication mistakes"],
      "improvements": ["List actionable advice for improvement"],
      "overallScore": 85,
      "summary": "Short overall feedback summary"
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" }
    });

    const review = JSON.parse(completion.choices[0].message.content);
    res.json(review);

  } catch (err) {
    console.error("Review Generation Error:", err);
    res.status(500).json({ message: "Failed to generate review" });
  }
});

