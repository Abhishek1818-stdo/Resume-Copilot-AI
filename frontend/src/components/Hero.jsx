function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <h1>🤖 Resume Copilot AI</h1>

        <p>
          Your AI-powered career assistant that analyzes resumes,
          improves ATS scores, generates interview questions,
          recommends jobs, and creates professional cover letters.
        </p>

        <div className="hero-buttons">
          <button className="hero-btn">
            🚀 Get Started
          </button>

          <button className="hero-btn secondary">
            📊 Learn More
          </button>
        </div>

      </div>

      <div className="features">

        <div className="feature-card">
          <span>📊</span>
          <h3>ATS Score</h3>
          <p>Instant resume scoring with AI.</p>
        </div>

        <div className="feature-card">
          <span>🤖</span>
          <h3>AI Analysis</h3>
          <p>Strengths, weaknesses and suggestions.</p>
        </div>

        <div className="feature-card">
          <span>💼</span>
          <h3>Interview Prep</h3>
          <p>HR, Technical and Project questions.</p>
        </div>

        <div className="feature-card">
          <span>📄</span>
          <h3>Cover Letter</h3>
          <p>Create professional cover letters instantly.</p>
        </div>

      </div>

    </section>
  );
}

export default Hero;