import dotenv from "dotenv";
dotenv.config();   // ⭐ MUST BE FIRST

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";


console.log("OPENAI KEY =>", process.env.OPENAI_API_KEY);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);


app.get("/", (req, res) => {
  res.send("SkillPrep API running");
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

