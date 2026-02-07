import { useLocation, useNavigate } from "react-router-dom";
import "./intro.css";

export default function QuizResult() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) return null;

  const { score, total } = location.state;

  return (
    <div className="colorlib-page">
      <section className="hero" style={{ justifyContent: "center" }}>
        <div className="hero-left">
          <h1>Quiz Completed 🎉</h1>
          <p>
            Score: {score} / {total}
          </p>

          <button className="get-started" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}
