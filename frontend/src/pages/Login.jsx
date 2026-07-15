import { useState } from "react";
import axios from "axios";
import "./../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("https://resume-copilot-ai.onrender.com/login", {
        name: "",
        email,
        password,
      });

      alert(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.detail || "Login Failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>🤖 Resume Copilot AI</h1>

        <p>Welcome back! Login to continue.</p>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={login}
        >
          Login
        </button>

        <div className="signup-link">
          Don't have an account?{" "}
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;