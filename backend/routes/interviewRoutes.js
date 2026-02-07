import express from "express";
import Interview from "../models/Interview.js";

const router = express.Router();

/* ================= QUESTION BANK ================= */

const questionBank = {
  frontend: [
    { type: "theory", question: "Explain Virtual DOM in React." },
    { type: "coding", question: "Write a JS function to reverse a string." },
    { type: "coding", question: "Create React counter using useState." },
    { type: "theory", question: "What is useEffect?" },
    { type: "coding", question: "Remove duplicates from array in JS." },
  ],

  backend: [
    { type: "theory", question: "Explain REST API." },
    { type: "coding", question: "Create login API using Node + JWT." },
    { type: "coding", question: "Write MongoDB query to find user by email." },
    { type: "theory", question: "Difference SQL vs NoSQL?" },
    { type: "coding", question: "Create Express middleware example." },
  ],

  fullstack: [
    { type: "coding", question: "Build login system using Node + React." },
    { type: "coding", question: "Fetch API data using useEffect." },
    { type: "theory", question: "Explain MERN architecture." },
    { type: "coding", question: "Create protected route in React." },
  ],

  dsa: [
    { type: "coding", question: "Implement Binary Search." },
    { type: "coding", question: "Reverse Linked List." },
    { type: "coding", question: "Find factorial using recursion." },
    { type: "theory", question: "Explain Big-O notation." },
  ],
};

/* ================= SHUFFLE ================= */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ================= GENERATE QUESTIONS ================= */

router.post("/generate", async (req, res) => {
  try {
    const { role } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    if (!role || !questionBank[role]) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await Interview.findOne({ role, date: today });
    if (existing) return res.json(existing.questions);

    const questions = shuffle([...questionBank[role]]).slice(0, 4);

    await Interview.create({
      role,
      date: today,
      questions,
    });

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate questions" });
  }
});

/* ================= SIMPLE SCORE ================= */

router.post("/evaluate", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({ message: "Answers required" });
    }

    let score = 0;

    answers.forEach((a) => {
      if (a && a.length > 15) score += 2;
    });

    const total = answers.length * 2;

    res.json({
      score,
      total,
      feedback:
        score >= total * 0.7
          ? "Good performance 👍"
          : "Try explaining more clearly and improve logic.",
    });
  } catch (err) {
    res.status(500).json({ message: "Evaluation failed" });
  }
});

export default router;
