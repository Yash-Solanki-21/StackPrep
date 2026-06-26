import { useNavigate, useLocation } from "react-router";
import "./McqResult.css";

export default function McqResult() {
  const navigate = useNavigate();
  const location = useLocation();

 const state = location.state || {};

const score = state.score ?? 0;
const total = state.total ?? 0;
const correctCount = state.correctCount ?? 0;
const wrongCount = state.wrongCount ?? 0;
const unattemptedCount = state.unattemptedCount ?? 0;
const timeTaken = state.timeTaken ?? "00:00:00";

const accuracy =
  total > 0 ? Math.round((score / total) * 100) : 0;

  const getMessage = () => {
    if (accuracy >= 80) return { emoji: "🎉", title: "Great Job!", sub: "You have completed the test." };
    if (accuracy >= 50) return { emoji: "👍", title: "Good Effort!", sub: "You're getting there, keep practicing." };
    return { emoji: "💪", title: "Keep Going!", sub: "Practice more to improve your score." };
  };

  const msg = getMessage();

  const improvements = [
    "Review the questions you got wrong to understand the concepts better.",
    "Focus more on topics where you spent the most time.",
    "Practice similar MCQs daily to improve speed and accuracy.",
  ];

  return (
    <div className="result-page">
      <div className="result-wrapper">

        <div className="result-grid">

          {/* LEFT — Congratulation Card */}
          <div className="congrats-card">
            <div className="trophy-circle">
              <span className="trophy-emoji">🏆</span>
              <span className="confetti c1">✦</span>
              <span className="confetti c2">✦</span>
              <span className="confetti c3">✦</span>
            </div>
            <h2>{msg.title} {msg.emoji}</h2>
            <p>{msg.sub}</p>
          </div>

          {/* RIGHT — Score Stats */}
          <div className="stats-card">
            <div className="stat-block">
              <span className="stat-label">Score</span>
              <h2 className="stat-value">{score} / {total}</h2>
            </div>
            <div className="stat-block">
              <span className="stat-label">Accuracy</span>
              <h2 className="stat-value">{accuracy}%</h2>
            </div>
            <div className="stat-block">
              <span className="stat-label">Time Taken</span>
              <h2 className="stat-value">{timeTaken}</h2>
            </div>
          </div>

        </div>

        {/* PERFORMANCE BAR */}
        <div className="performance-card">
          <div className="performance-header">
            <span>Your Performance</span>
            <span className="performance-pct">{accuracy}%</span>
          </div>
          <div className="performance-bar">
            <div className="performance-fill" style={{ width: `${accuracy}%` }} />
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="breakdown-row">
          <div className="breakdown-item correct">
            <span className="breakdown-num">{correctCount}</span>
            <span className="breakdown-label">Correct</span>
          </div>
          <div className="breakdown-item wrong">
            <span className="breakdown-num">{wrongCount}</span>
            <span className="breakdown-label">Wrong</span>
          </div>
          <div className="breakdown-item unattempted">
            <span className="breakdown-num">{unattemptedCount}</span>
            <span className="breakdown-label">Unattempted</span>
          </div>
        </div>

        {/* IMPROVEMENT TIPS */}
        <div className="review-card">
          <h4>Areas to Improve</h4>
          <ul>
            {improvements.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* ACTION BUTTONS */}
        <div className="result-actions">
          <button className="result-btn-secondary" onClick={() => navigate("/mcq")}>
            Go to Assessment
          </button>
          <button className="result-btn-primary" onClick={() => navigate("/mcq")}>
            Retake Test
          </button>
        </div>

      </div>
    </div>
  );
}