import { useState } from "react";
import "./intro.css";

export default function Interview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const startInterview = async () => {
    if (!role) return alert("Enter role");

    const res = await fetch("http://localhost:5000/api/ai/interview-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    const data = await res.json();
    setQuestions(data);
  };

  const next = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="colorlib-page">
        <div className="hero">
          <div className="hero-left">
            <h1>Interview Completed 🎉</h1>
            <p>You answered {answers.length} questions.</p>
            <button className="get-started" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="colorlib-page">
      <div className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left" style={{ maxWidth: "720px" }}>

          {!questions.length ? (
            <>
              <h1>Interview Prep</h1>
              <p>Enter role to start interview</p>

              <input
                placeholder="e.g. Developer / AI / Backend"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: "12px",
                  width: "100%",
                  borderRadius: "10px",
                  border: "none",
                  marginTop: "20px",
                }}
              />

              <button
                className="get-started"
                style={{ marginTop: "20px" }}
                onClick={startInterview}
              >
                Start Interview
              </button>
            </>
          ) : (
            <>
              <h2>Question {current + 1}</h2>
              <p>{questions[current]}</p>

              <textarea
                placeholder="Type your answer..."
                onChange={(e) => {
                  const copy = [...answers];
                  copy[current] = e.target.value;
                  setAnswers(copy);
                }}
                style={{
                  width: "100%",
                  height: "140px",
                  borderRadius: "10px",
                  padding: "10px",
                  border: "none",
                  marginTop: "20px",
                }}
              />

              <button
                className="get-started"
                style={{ marginTop: "20px" }}
                onClick={next}
              >
                {current + 1 === questions.length ? "Finish" : "Next"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
