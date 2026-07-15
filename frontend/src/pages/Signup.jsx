import { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/signup", {
        name,
        email,
        password,
      });

      alert(res.data.message);

      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.detail || "Signup Failed");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h1>🤖 Resume Copilot AI</h1>

        <p>Create your account to get started</p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="signup-btn"
          onClick={signup}
        >
          Create Account
        </button>

        <div className="login-link">
          Already have an account?{" "}
          <a href="/login">Login</a>
        </div>

      </div>
    </div>
  );
}

export default Signup;