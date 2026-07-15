import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "../styles/ResumeDetails.css";

function ResumeDetails() {
  const { id } = useParams();

  const [resume, setResume] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/resume/${id}`)
      .then((res) => {
        setResume(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const downloadPDF = () => {
    if (!resume) return;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(22);
    doc.text("Resume Copilot AI Report", 20, y);

    y += 15;

    doc.setFontSize(14);
    doc.text(`Resume: ${resume.filename}`, 20, y);

    y += 10;

    doc.text(`ATS Score: ${resume.ats_score}`, 20, y);

    y += 15;

    doc.setFontSize(16);
    doc.text("Professional Summary", 20, y);

    y += 10;

    doc.setFontSize(12);

    const summary = doc.splitTextToSize(
      resume.summary || "",
      170
    );

    doc.text(summary, 20, y);

    y += summary.length * 7 + 10;

    doc.setFontSize(16);
    doc.text("Strengths", 20, y);

    y += 10;

    resume.strengths?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    y += 5;

    doc.setFontSize(16);
    doc.text("Weaknesses", 20, y);

    y += 10;

    resume.weaknesses?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    y += 5;

    doc.setFontSize(16);
    doc.text("Career Suggestions", 20, y);

    y += 10;

    resume.career_suggestions?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    y += 5;

    doc.setFontSize(16);
    doc.text("Recommended Jobs", 20, y);

    y += 10;

    resume.recommended_jobs?.forEach((item) => {
      doc.text(`• ${item}`, 25, y);
      y += 7;
    });

    doc.save("Resume_Copilot_Report.pdf");
  };

  if (!resume) {
    return (
      <div className="resume-details-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="resume-details-container">

      <h1 className="resume-title">
        📄 {resume.filename}
      </h1>

      <div className="download-section">
        <button
          className="download-btn"
          onClick={downloadPDF}
        >
          📄 Download PDF Report
        </button>
      </div>

      <div className="ats-card">
        <h2>⭐ ATS Score</h2>
        <div className="ats-score">
          {resume.ats_score}%
        </div>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          📄 Professional Summary
        </h2>

        <p>{resume.summary}</p>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          💪 Strengths
        </h2>

        <ul>
          {resume.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          ⚠️ Weaknesses
        </h2>

        <ul>
          {resume.weaknesses?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          🤖 Missing AI Skills
        </h2>

        <ul>
          {resume.missing_ai_skills?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>      <div className="section-card">
        <h2 className="section-title">
          🎯 Career Suggestions
        </h2>

        <ul>
          {resume.career_suggestions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          💼 Recommended Jobs
        </h2>

        <ul>
          {resume.recommended_jobs?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          👨‍💼 HR Interview Questions
        </h2>

        <ol>
          {resume.hr_questions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          💻 Technical Interview Questions
        </h2>

        <ol>
          {resume.technical_questions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="section-card">
        <h2 className="section-title">
          🚀 Project Interview Questions
        </h2>

        <ol>
          {resume.project_questions?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

    </div>
  );
}

export default ResumeDetails;