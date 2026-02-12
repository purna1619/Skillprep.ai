import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="colorlib-page">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          Sk<span>.</span>
        </div>

        <ul className="nav-links">
          <li onClick={() => scrollToSection("about")}>About</li>
          <li onClick={() => scrollToSection("features")}>Features</li>
          <li className="nav-item" onClick={() => scrollToSection("contact")}>
            Contact
          </li>
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
                    ? `${user.scores[user.scores.length - 1].score} / ${user.scores[user.scores.length - 1].total
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
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </button>
          )}
        </motion.div>

        {/* RIGHT — DASHBOARD AFTER LOGIN */}
        {user && (
          <div className="hero-right">
            <div className="feature-box">

              <motion.div
                className="feature-card"
                onClick={() => navigate("/notes")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <h3>🧠 Notes → Quiz (MCQs)</h3>
                <p>Convert notes into AI-generated quizzes.</p>
              </motion.div>

              <motion.div
                className="feature-card"
                onClick={() => navigate("/interview")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.03 }}
              >
                <h3>🎤 Interview Prep with AI</h3>
                <p>Practice real interview-style questions.</p>
              </motion.div>

            </div>
          </div>
        )}
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose SkillPrep AI?
        </motion.h2>

        <div className="features-grid">
          <motion.div
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3>📄 Notes to Quiz</h3>
            <p>Paste your study notes and let our AI generate multiple-choice questions instantly to test your knowledge.</p>
          </motion.div>

          <motion.div
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3>🎤 AI Voice Interviewer</h3>
            <p>Experience realistic technical interviews with our AI that speaks to you and reacts to your answers in real-time.</p>
          </motion.div>

          <motion.div
            className="feature-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>📊 Performance Tracking</h3>
            <p>Keep track of your quiz scores and interview attempts to monitor your progress over time.</p>
          </motion.div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about" className="section-container about-section">
        <motion.div
          className="about-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2>About Us</h2>
          <p>
            SkillPrep AI was built with a single mission: to make career preparation accessible, smart, and interactive.
            Whether you are a student preparing for exams or a professional gearing up for your next big interview,
            our AI-powered tools are designed to give you the competitive edge you need.
          </p>
          <p>
            Built by <strong>Poorna Chandra</strong>, this platform leverages the latest in Generative AI to provide
            personalized learning experiences.
          </p>
        </motion.div>
      </section>

      {/* ================= CONTACT / FOOTER SECTION ================= */}
      <footer id="contact" className="footer-section">
        <div className="footer-content">
          <motion.div
            className="footer-logo"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            Sk<span>.</span>
          </motion.div>

          <div className="footer-info">
            <h3>Get in Touch</h3>
            <p>Ready to sharpen your skills? Contact us for any queries or feedback.</p>
            <div className="contact-details">
              <a href="mailto:purnachandra1619@gmail.com" className="contact-link">📧 purnachandra1619@gmail.com</a>
              <a
                href="https://github.com/PoornaChandra1619"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="20" />
                GitHub Profile
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} SkillPrep AI. Built by Poorna Chandra.</p>
          </div>
        </div>
      </footer>

      {/* AUTH MODAL */}
      {showAuth && <AuthModal close={() => setShowAuth(false)} />}
    </div>
  );
}
