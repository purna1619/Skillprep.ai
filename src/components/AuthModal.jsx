import { useState } from "react";
import "./auth.css";
import { registerUser, loginUser } from "../services/authService";

export default function AuthModal({ close }) {
  const [isLogin, setIsLogin] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await loginUser({
          email: form.email,
          password: form.password,
        });
      } else {
        data = await registerUser(form);
      }

      if (!data || !data.token) {
        throw new Error("No token received from server");
      }

      // Save login data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(isLogin ? "Login successful 🎉" : "Registered successfully 🎉");

      close();
      window.location.href = "/";
    } catch (error) {   // 🔥 FIX: error variable defined
      console.error(error);
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>✕</button>

        <h2>{isLogin ? "Welcome back" : "Get started in seconds"}</h2>

        {error && <p className="auth-error">{error}</p>}

        {!isLogin && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="register"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Registering..."
            : isLogin
            ? "Login"
            : "Register"}
        </button>

        <div className="or">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </div>

        <button
          className="google"
          onClick={() => {
            setError("");
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Create new account" : "Login"}
        </button>
      </div>
    </div>
  );
}
