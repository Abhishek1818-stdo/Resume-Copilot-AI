import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ResumeHistory.css";

function ResumeHistory() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/resumes");
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/resume/${id}`);
      setResumes((prev) => prev.filter((resume) => resume.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredResumes = [...resumes]
    .filter((resume) =>
      resume.filename.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "highest") return b.ats_score - a.ats_score;
      if (sortBy === "lowest") return a.ats_score - b.ats_score;
      if (sortBy === "latest") return b.id.localeCompare(a.id);
      if (sortBy === "oldest") return a.id.localeCompare(b.id);
      return 0;
    });

  return (
    <div className="history-container">

      <div className="history-header">
        <h1>📜 Resume History</h1>
        <p>View, search and manage all analyzed resumes.</p>
      </div>

      <div className="history-controls">

        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search Resume..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="sort-dropdown"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest ATS</option>
          <option value="lowest">Lowest ATS</option>
        </select>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>📄 Resume</th>
              <th>⭐ ATS Score</th>
              <th>⚙ Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => (

                <tr key={resume.id}>

                  <td className="resume-name">
                    {resume.filename}
                  </td>

                  <td>

                    <span
                      className={
                        resume.ats_score >= 85
                          ? "ats-badge high"
                          : resume.ats_score >= 70
                          ? "ats-badge medium"
                          : "ats-badge low"
                      }
                    >
                      {resume.ats_score}%
                    </span>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() => navigate(`/resume/${resume.id}`)}
                    >
                      👁 View
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteResume(resume.id)}
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))
            ) : (
              <tr>

                <td
                  colSpan="3"
                  className="no-data"
                >
                  📂 No resumes found.
                </td>

              </tr>
            )}

          </tbody>

        </table>

      </div>

      <div className="history-footer">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default ResumeHistory;