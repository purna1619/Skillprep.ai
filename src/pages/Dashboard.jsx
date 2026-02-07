import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard ✅</h2>
      <button onClick={() => navigate("/quiz/DSA")}>
        Start DSA Quiz
      </button>
    </div>
  );
}
