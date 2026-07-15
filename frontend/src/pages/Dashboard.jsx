import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_resumes: 0,
    highest_ats: 0,
    average_ats: 0,
    latest_resume: "None",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const chartData = {
    labels: ["Total Resumes", "Highest ATS", "Average ATS"],
    datasets: [
      {
        label: "Analytics",
        data: [
          stats.total_resumes,
          stats.highest_ats,
          stats.average_ats,
        ],
        backgroundColor: [
          "#2563eb",
          "#22c55e",
          "#f59e0b",
        ],
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "#334155",
        },
      },
      y: {
        ticks: {
          color: "#cbd5e1",
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  return (
    <div className="dashboard">

      {/* Navbar */}

      <nav className="dashboard-navbar">

        <div className="logo">
          🤖 Resume Copilot AI
        </div>

        <div className="navbar-right">

          <span className="welcome-user">
            👋 {user?.name}
          </span>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Main */}

      <div className="dashboard-content">

        {/* Hero */}

        <div className="dashboard-hero">

          <div>

            <h1>
              Welcome Back, {user?.name} 👋
            </h1>

            <p>
              Analyze resumes, improve ATS score,
              generate interview questions and
              AI-powered cover letters.
            </p>

          </div>

          <div className="hero-badge">
            🤖 AI Powered
          </div>

        </div>

        {/* Cards */}

        <div className="cards">

          <div className="card">
            <h2>📄 Total Resumes</h2>
            <h1>{stats.total_resumes}</h1>
          </div>

          <div className="card">
            <h2>🏆 Highest ATS</h2>
            <h1>{stats.highest_ats}%</h1>
          </div>

          <div className="card">
            <h2>📈 Average ATS</h2>
            <h1>{stats.average_ats}%</h1>
          </div>

          <div className="card">
            <h2>📂 Latest Resume</h2>
            <h3>{stats.latest_resume}</h3>
          </div>

        </div>

        {/* Analytics */}

        <div className="analytics-section">

          <h2 className="analytics-title">
            📊 Dashboard Analytics
          </h2>

          <Bar
            data={chartData}
            options={chartOptions}
          />

        </div>

        {/* Quick Actions */}

        <div className="quick-actions">

          <button
            className="dashboard-btn"
            onClick={() => navigate("/")}
          >
            🚀 Analyze Resume
          </button>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/history")}
          >
            📜 Resume History
          </button>

          <button
            className="dashboard-btn"
            onClick={() => navigate("/cover-letter")}
          >
            📄 Cover Letter
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;