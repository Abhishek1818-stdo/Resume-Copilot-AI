import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "../styles/CoverLetter.css";

function CoverLetter() {
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [filename, setFilename] = useState("Loading...");

  useEffect(() => {
    loadLatestResume();
  }, []);

  const loadLatestResume = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/latest-resume"
      );

      setFilename(
        res.data.filename || "No Resume Found"
      );

      setResumeText(
        res.data.resume_text || ""
      );

    } catch (err) {

      console.error(err);

      setFilename("No Resume Found");

      setResumeText("");
    }
  };

  const generateCoverLetter = async () => {

    if (!companyName.trim()) {
      alert("Please enter Company Name");
      return;
    }

    if (!jobRole.trim()) {
      alert("Please enter Job Role");
      return;
    }

    if (!resumeText.trim()) {
      alert("Please upload a resume first.");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/cover-letter",
        {
          company_name: companyName,
          job_role: jobRole,
          resume_text: resumeText,
        }
      );

      setCoverLetter(
        res.data.cover_letter
      );

    } catch (err) {

      console.error(err);

      alert("Failed to generate cover letter.");

    } finally {

      setLoading(false);

    }
  };

  const copyCoverLetter = async () => {

    try {

      await navigator.clipboard.writeText(
        coverLetter
      );

      alert(
        "✅ Cover Letter copied successfully!"
      );

    } catch (err) {

      alert("Failed to copy.");

    }

  };

  const downloadPDF = () => {

    if (!coverLetter) {

      alert(
        "Generate a cover letter first."
      );

      return;

    }

    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    doc.setFontSize(12);

    const lines = doc.splitTextToSize(
      coverLetter,
      180
    );

    doc.text(lines, 15, 20);

    doc.save("Cover_Letter.pdf");
  };

  return (

    <div className="cover-container">

      <div className="cover-card">

        <h1>
          🤖 AI Cover Letter Generator
        </h1>

        <p className="subtitle">
          Create a professional AI-powered cover
          letter tailored to your resume.
        </p>

        <div className="resume-info">

          <span>
            Latest Resume
          </span>

          <span
            className={
              filename === "No Resume Found"
                ? "resume-error"
                : "resume-success"
            }
          >
            {filename}
          </span>

        </div>

        <input
          type="text"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
          className="cover-input"
        />

        <input
          type="text"
          placeholder="Enter Job Role"
          value={jobRole}
          onChange={(e) =>
            setJobRole(e.target.value)
          }
          className="cover-input"
        />

        <button
          className="generate-btn"
          onClick={generateCoverLetter}
          disabled={loading}
        >
          {loading
            ? "🤖 Generating..."
            : "🚀 Generate Cover Letter"}
        </button>
                {coverLetter && (

          <div className="cover-result">

            <h2>
              📄 Generated Cover Letter
            </h2>

            <textarea
              value={coverLetter}
              onChange={(e) =>
                setCoverLetter(e.target.value)
              }
              className="cover-textarea"
              rows={18}
            />

            <div className="cover-actions">

              <button
                className="copy-btn"
                onClick={copyCoverLetter}
              >
                📋 Copy
              </button>

              <button
                className="pdf-btn"
                onClick={downloadPDF}
              >
                📄 Download PDF
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default CoverLetter;