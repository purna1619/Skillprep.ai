import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./intro.css"; // 👈 reuse SAME CSS

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const generateQuiz = () => {
    if (!notes.trim()) {
      alert("Please enter notes");
      return;
    }
    navigate("/quiz", { state: { notes } });
  };

  return (
    <div className="colorlib-page">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo">
          Sk<span>.</span>
        </div>

        <ul className="nav-links">
          <li onClick={() => navigate("/")}>Home</li>
          <li>Features</li>
          <li>Contact</li>
        </ul>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>👤 {user?.name}</span>
          <button className="nav-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <section className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left" style={{ maxWidth: "720px" }}>
          <h1>
            Notes<span> → Quiz</span>
          </h1>

          <p>Paste your notes below and generate MCQ quiz instantly.</p>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here..."
            style={{
              width: "100%",
              height: "220px",
              padding: "18px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              fontSize: "16px",
              marginTop: "20px",
            }}
          />

          <button
            className="get-started"
            style={{ marginTop: "26px" }}
            onClick={generateQuiz}
          >
            Generate MCQ Quiz
          </button>
        </div>
      </section>
    </div>
  );
}
