import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";
import "./McqTest.css";
import "./McqSetup.css"

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function McqTest() {
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);

const [duration, setDuration] = useState(20);
const [timeLeft, setTimeLeft] = useState(20 * 60);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  
 const getStatus = (index) => {
    if (index === current) return "current";
    if (marked[index]) return "marked";
    if (answers[index] !== undefined) return "answered";
    return "unanswered";
  };

 useEffect(() => {
  if (timeLeft <= 0) return;
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      const next = prev - 1;
      sessionStorage.setItem("mcq_timeLeft", next);  // ← add karo
      return next;
    });
  }, 1000);
  return () => clearInterval(timer);
}, [timeLeft]);

useEffect(() => {
  const d = location.state?.duration ?? 20;
  setDuration(d);
  setTimeLeft(d * 60);
}, [location.state]);

 useEffect(() => {
  const data = location.state?.mcqs; 
  if (Array.isArray(data)) {
    console.log(`Questions Received: ${data.length}`);
    setQuestions(data);
  } else if (typeof data === "string") {
    setQuestions(JSON.parse(data));
  } else {
    setQuestions([]);
  }
  setLoading(false);
}, [location.state]);


  const q = questions?.[current];

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [current]: optIndex }));
  };

  const toggleMark = () => {
    setMarked((prev) => ({ ...prev, [current]: !prev[current] }));
  };

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;
  const progressPct = Math.round((answeredCount / questions.length) * 100);

  const handleSubmit = useCallback(async() => {
    setSubmitting(true);
  sessionStorage.removeItem("mcq_timeLeft");
  sessionStorage.removeItem("mcq_questions");

  const correctCount = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const wrongCount = Object.keys(answers).length - correctCount;
  const unattemptedCount = questions.length - Object.keys(answers).length;

   const token = localStorage.getItem("token");

    await axiosInstance.post("/mcq/submit-test", {
  score: correctCount,
  totalQuestions: questions.length,
  percentage: Math.round((correctCount / questions.length) * 100),
  topic: location.state?.topic || "Mixed Topics",
});

  navigate("/mcq/test/result", {
    state: {
      score: correctCount,
      total: questions.length,
      correctCount,
      wrongCount,
      unattemptedCount,
      timeTaken: formatTime((duration * 60) - timeLeft),
      accuracy: Math.round((correctCount / questions.length) * 100),
    },
  });
}, [questions, answers, duration, timeLeft, navigate, location.state]);


useEffect(() => {
  if (timeLeft === 0) {
    handleSubmit();
  }
}, [timeLeft, handleSubmit]);

      if (loading) {
      return <h2>Loading questions...</h2>;
      }
      if (questions.length === 0) {
      return <h2>No questions found</h2>;
      }

      if (submitting) {
  return (
    <div className="ai-overlay">
      <div className="ai-card">
        <div className="ai-icon-wrap">
          <div className="ai-spinner"></div>
          <div className="ai-icon-circle">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
          </div>
        </div>

        <div className="ai-text">
          <p className="ai-heading">Preparing your results</p>
          <p className="ai-sub">Calculating your score...</p>
        </div>

        <div className="ai-dots">
          <span className="ai-dot"></span>
          <span className="ai-dot"></span>
          <span className="ai-dot"></span>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="mcq-test-page">
      <div className="mcq-test-topbar">
        <button className="back-btn" onClick={() => navigate("/mcq")}>← Back</button>
        <h2>MCQ Test</h2>
        <div className="timer">
          <span className="timer-dot" />
          Time Left: <strong>{formatTime(timeLeft)}</strong>
        </div>
      </div>

      <div className="mcq-test-grid">
        {/* QUESTION CARD */}
        <div className="question-card">
          <div className="q-top-row">
            <p className="q-progress">Question {current + 1} of {questions.length}</p>
            <button className="mark-btn" onClick={toggleMark}>
              {marked[current] ? "★ Marked" : "☆ Mark for Review"}
            </button>
          </div>

          <h3 className="q-text">{q.question}</h3>

          <div className="options">
           {q?.options?.map((opt, i) => (
          <button
            key={i}
              className={`option ${answers[current] === i ? "selected" : ""}`}
              onClick={() => selectOption(i)}
            >
            <span className="opt-letter">{String.fromCharCode(65 + i)}.</span>
            {opt}
            </button>
              ))}
          </div>

          <div className="q-nav-buttons">
            <button
              className="nav-btn"
              disabled={current === 0}
              onClick={() => setCurrent((c) => c - 1)}
            >
              Previous
            </button>
            <button
              className="nav-btn primary"
              disabled={current === questions.length - 1}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {/* QUESTION NAVIGATION CARD */}
        <div className="nav-card">
          <h4>Question Navigation</h4>
          <div className="nav-grid">
  {Array.isArray(questions) &&
    questions.map((_, i) => (
      <button
        key={i}
        className={`nav-cell ${getStatus(i)}`}
        onClick={() => setCurrent(i)}
      >
        {i + 1}
      </button>
    ))}
</div>
          <div className="legend">
            <div className="legend-item">
              <span className="dot answered" /> Answered
            </div>
            <div className="legend-item">
              <span className="dot current" /> Current
            </div>
            <div className="legend-item">
              <span className="dot marked" /> Marked for Review
            </div>
            <div className="legend-item">
              <span className="dot unanswered" /> Unanswered
            </div>
          </div>

          <button className="submit-test-btn" onClick={handleSubmit}>Submit Test</button>
        </div>

        {/* NEW — SIDE CARD (right of nav-card) */}
        <div className="side-card">
          <h4>Test Overview</h4>

          <div className="progress-circle-wrap">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="36" className="pc-bg" />
              <circle
                cx="45" cy="45" r="36"
                className="pc-fill"
                strokeDasharray={2 * Math.PI * 36}
                strokeDashoffset={2 * Math.PI * 36 - (progressPct / 100) * 2 * Math.PI * 36}
              />
              <text x="45" y="50" textAnchor="middle" className="pc-text">{progressPct}%</text>
            </svg>
            <p className="pc-label">Completed</p>
          </div>

          <div className="summary-box">
            <div className="summary-row">
              <span>Answered</span>
              <strong className="answered-text">{answeredCount}</strong>
            </div>
            <div className="summary-row">
              <span>Marked</span>
              <strong className="marked-text">{markedCount}</strong>
            </div>
            <div className="summary-row">
              <span>Unanswered</span>
              <strong className="unanswered-text">{unansweredCount}</strong>
            </div>
          </div>

          <div className="tip-box">
            <p className="tip-title">💡 Tip</p>
            <p className="tip-text">Mark difficult questions for review and come back to them before submitting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}