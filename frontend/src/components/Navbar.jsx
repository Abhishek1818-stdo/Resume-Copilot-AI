import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <h2>🚀 Resume Copilot AI</h2>
      </div>

      <div className="nav-links">

        {!user ? (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/">
              <button>🏠 Home</button>
            </Link>

            <Link to="/dashboard">
              <button>📊 Dashboard</button>
            </Link>

            <Link to="/history">
              <button>📜 History</button>
            </Link>

            <Link to="/cover-letter">
              <button>📄 Cover Letter</button>
            </Link>

            <span
              style={{
                color: "#60a5fa",
                fontWeight: "bold",
                marginLeft: "15px",
                marginRight: "15px",
              }}
            >
              👋 {user.name}
            </span>

            <button onClick={logout}>
              🚪 Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;