const API_URL = "http://127.0.0.1:5000/api/auth";

/* ================= REGISTER ================= */
export const registerUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || result.msg || "Register failed");
    }

    return result; // { token, user }
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    throw new Error("Server not reachable / Register failed");
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (data) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || result.msg || "Login failed");
    }

    // 🔐 Extra safety
    if (!result.token) {
      throw new Error("Token not received from server");
    }

    return result; // { token, user }
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    throw new Error("Server not reachable / Login failed");
  }
};
