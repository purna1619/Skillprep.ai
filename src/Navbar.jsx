import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        background: "#020617",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <Link style={link} to="/">Dashboard</Link>
      <Link style={link} to="/interview">Interview</Link>
      <Link style={link} to="/notes">Notes</Link>
    </nav>
  );
}

const link = {
  color: "white",
  textDecoration: "none",
  fontSize: "18px",
};
