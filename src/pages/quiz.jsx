import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./intro.css";

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mcqs, setMcqs] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!location.state || !location.state.notes) {
      navigate("/notes");
      return;
    }

    generateMCQ(location.state.notes);
  }, []);

  const generateMCQ = async (notes) => {
    try {
      const res = await fetch("http://localhost:5000/api/ai/generate-mcqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMcqs(data);
    } catch (err) {
      alert("MCQ generation failed");
      navigate("/notes");
    }
  };

  /* ================= SAVE SCORE ================= */
  const saveScore = async (finalScore, total) => {
    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/ai/save-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: finalScore,
          total,
        }),
      });
    } catch (err) {
      console.error("Score save failed", err);
    }
  };

  if (!mcqs.length) {
    return (
      <div className="colorlib-page">
        <div className="hero">
          <h2>Generating Quiz...</h2>
        </div>
      </div>
    );
  }

  const q = mcqs[current];

  const selectAnswer = (option) => {
    let newScore = score;

    if (option === q.answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (current + 1 < mcqs.length) {
      setCurrent(current + 1);
    } else {
      // 🔥 STEP-3 IMPLEMENT HERE (QUIZ FINISH)
      saveScore(newScore, mcqs.length);

      navigate("/quiz/result", {
        state: { score: newScore, total: mcqs.length },
      });
    }
  };

  return (
    <div className="colorlib-page">
      <section className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left" style={{ maxWidth: "720px" }}>
          <h2>Question {current + 1}</h2>
          <p>{q.question}</p>

          {q.options.map((opt, i) => (
            <button
              key={i}
              className="get-started"
              style={{ display: "block", marginTop: "14px", width: "100%" }}
              onClick={() => selectAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
