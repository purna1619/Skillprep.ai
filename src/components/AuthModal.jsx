import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./auth.css";
import { registerUser, loginUser, googleLogin } from "../services/authService";

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

  const validate = () => {
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return "Please enter a valid email address";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      return "Password must contain at least one special character";
    }
    if (!isLogin && !form.name) {
      return "Name is required";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

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

      if (!data?.token) {
        throw new Error(data?.msg || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(isLogin ? "Login successful 🎉" : "Registered successfully 🎉");
      close();
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError(err.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const data = await googleLogin(credentialResponse.credential);

      if (!data?.token) {
        throw new Error(data?.msg || "Google Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful 🎉");
      close();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message || "Google Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={close}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>✕</button>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {isLogin ? "Enter your details to login" : "Get started with your free account"}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="social-login">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            useOneTap
            theme="filled_blue"
            shape="pill"
            text="continue_with"
            width="100%"
          />
        </div>

        <div className="divider">
          <span>OR</span>
        </div>

        {!isLogin && (
          <div className="input-group">
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="input-group">
          <input
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder="Password (6+ chars, special char)"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="toggle-auth">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => { setError(""); setIsLogin(!isLogin); }}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
