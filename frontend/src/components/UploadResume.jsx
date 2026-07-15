import { useState } from "react";
import axios from "axios";
import "../styles/UploadResume.css";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
const response = await axios.post(
  "https://resume-copilot-ai.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">

      <h1>🚀 Resume Copilot AI</h1>

      <div className="upload-box">

  <div className="upload-icon">
    📄
  </div>

  <h2>Upload Your Resume</h2>

  <p className="upload-text">
    Upload a PDF resume and let AI analyze it instantly.
  </p>

  <input
    type="file"
    accept=".pdf"
    onChange={(e) => setFile(e.target.files[0])}
  />

  {file && (
    <div className="selected-file">
      ✅ {file.name}
    </div>
  )}

  <button
    className="analyze-btn"
    onClick={handleUpload}
  >
    {loading ? "🤖 AI Analyzing..." : "🚀 Analyze Resume"}
  </button>

</div>



     {loading && (
  <div className="loading">
    <h2>🤖 AI is analyzing your resume...</h2>
    <p>Please wait while AI calculates ATS Score and analyzes your resume.</p>
  </div>
)}

      {result && (

        <div className="cards">

          <div className="card">
            <h2>ATS Score</h2>

            <div className="score">
              {result.ats_score}/100
            </div>

          </div>

          <div className="card">
            <h2>Skills Found</h2>

            <ul>
              {result.skills_found?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

          </div>

          <div className="card">
            <h2>Missing Skills</h2>

            <ul>
              {result.missing_skills?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>

          </div>

          <div className="card">
            <h2>AI Suggestions</h2>

            <ul>
              {result.suggestions?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div
            className="card"
            style={{ gridColumn: "1 / span 2" }}
          >
            <h2>📄 Professional Summary</h2>

            <p>{result.summary}</p>

          </div>

          <div className="card">
            <h2>💪 Strengths</h2>

            <ul>
              {result.strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">
            <h2>⚠️ Weaknesses</h2>

            <ul>
              {result.weaknesses?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">
            <h2>🎯 Career Suggestions</h2>

            <ul>
              {result.career_suggestions?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="card">
            <h2>💼 Recommended Jobs</h2>

            <ul>
              {result.recommended_jobs?.map((job, index) => (
                <li key={index}>{job}</li>
              ))}
            </ul>

          </div>
                    <div
            className="card"
            style={{ gridColumn: "1 / span 2" }}
          >
            <h2>👨‍💼 HR Interview Questions</h2>

            <ul>
              {result.hr_questions?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>

          </div>

          <div
            className="card"
            style={{ gridColumn: "1 / span 2" }}
          >
            <h2>💻 Technical Interview Questions</h2>

            <ul>
              {result.technical_questions?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>

          </div>

          <div
            className="card"
            style={{ gridColumn: "1 / span 2" }}
          >
            <h2>🚀 Project Interview Questions</h2>

            <ul>
              {result.project_questions?.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>

          </div>

          <div
            className="card"
            style={{ gridColumn: "1 / span 2" }}
          >
            <h2>📄 Resume Preview</h2>

            <pre style={{ whiteSpace: "pre-wrap" }}>
              {result.text}
            </pre>

          </div>

        </div>

      )}

    </div>
  );
}

export default UploadResume;