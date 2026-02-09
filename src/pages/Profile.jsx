import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please login again.");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/ai/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError("Error loading profile");
    }
  };

  if (error) {
    return <h2 style={{ padding: 40, color: "red" }}>{error}</h2>;
  }

  if (!user) {
    return <h2 style={{ padding: 40 }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>👤 Profile</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>

      <h3>📊 Quiz History</h3>

      {user.scores?.length === 0 && <p>No quiz attempts yet</p>}

      {user.scores?.map((s, i) => (
        <div key={i} style={{
          padding: 10,
          margin: "10px 0",
          border: "1px solid #ddd",
          borderRadius: 8
        }}>
          Score: <b>{s.score} / {s.total}</b><br />
          Date: {new Date(s.date).toLocaleString()}
        </div>
      ))}
    </div>
  );
}
