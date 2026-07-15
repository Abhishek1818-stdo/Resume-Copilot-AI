import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeHistory from "./pages/ResumeHistory";
import ResumeDetails from "./pages/ResumeDetails";
import CoverLetter from "./pages/CoverLetter";
import "./styles/theme.css";

import "./styles/Home.css";

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Resume History */}
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <ResumeHistory />
            </ProtectedRoute>
          }
        />

        {/* Resume Details */}
        <Route
          path="/resume/:id"
          element={
            <ProtectedRoute>
              <ResumeDetails />
            </ProtectedRoute>
          }
        />

        {/* AI Cover Letter */}
        <Route
          path="/cover-letter"
          element={
            <ProtectedRoute>
              <CoverLetter />
            </ProtectedRoute>
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;