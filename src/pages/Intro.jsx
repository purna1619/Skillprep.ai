import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../components/AuthModal";
import "./intro.css";

export default function Intro() {
const navigate = useNavigate();
const [showAuth, setShowAuth] = useState(false);
const [showProfile, setShowProfile] = useState(false);
const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="colorlib-page">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
  Sk<span>.</span>
</div>


        <ul className="nav-links">
  <li onClick={() => navigate("/")}>Home</li>
  <li>About</li>
  <li>Features</li>
  <li>Contact</li>
</ul>


        {/* RIGHT SIDE */}
        {!user ? (
          <button className="nav-btn" onClick={() => setShowAuth(true)}>
            Sign Up Free
          </button>
        ) : (
          <div className="profile-dropdown">
  <div
    className="profile-trigger"
    onClick={() => setShowProfile((prev) => !prev)}
  >
    👤 {user.name}
  </div>

  {showProfile && (
    <div className="dropdown-menu">
      <div className="dropdown-item">👤 {user.name}</div>
      <div className="dropdown-item">
  📊 Latest Score: {user?.scores?.length
    ? `${user.scores[user.scores.length - 1].score} / ${
        user.scores[user.scores.length - 1].total
      }`
    : "No attempts"}
</div>

<div className="dropdown-item">
  🧠 Total Attempts: {user?.scores?.length || 0}
</div>

      <div
        className="dropdown-item logout"
        onClick={logout}
      >
        🚪 Logout
      </div>
    </div>
  )}
</div>


        )}
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="watermark">S</div>

        {/* LEFT */}
        <div className="hero-left">
          <h1>
            Skill<span>Prep</span> AI
          </h1>

          <p>
            Practice interviews. Convert notes into quizzes.
            <br />
            Prepare smarter for your career.
          </p>

          {!user && (
            <button
              className="get-started"
              onClick={() => setShowAuth(true)}
            >
              Get Started
            </button>
          )}
        </div>

        {/* RIGHT — DASHBOARD AFTER LOGIN */}
        {user && (
          <div className="hero-right">
            <div className="feature-box">

              <div
                className="feature-card"
                onClick={() => navigate("/notes")}
              >
                <h3>🧠 Notes → Quiz (MCQs)</h3>
                <p>Convert notes into AI-generated quizzes.</p>
              </div>

              <div
                className="feature-card"
                onClick={() => navigate("/interview")}
              >
                <h3>🎤 Interview Prep with AI</h3>
                <p>Practice real interview-style questions.</p>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* AUTH MODAL */}
      {showAuth && <AuthModal close={() => setShowAuth(false)} />}
    </div>
  );
}
