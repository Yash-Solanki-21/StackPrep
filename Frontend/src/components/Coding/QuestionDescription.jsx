import "./QuestionDescription.css";
import { useLocation } from "react-router";

export default function QuestionDescription({ problem, onBack }) {
  if (!problem) return <div className="question-description"><p>No problem selected.</p></div>;

  return (
    <div className="question-description">
      {/* <hr /> */}
      <div className="problem-header">
        <h1>{problem.title}</h1>
        <div className="problem-meta">
          <span className={problem.difficulty.toLowerCase()}>{problem.difficulty}</span>
          {problem.tags?.map((t, i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>

      <div className="problem-section">
        <h3>Description</h3>
        <p>{problem.description}</p>
      </div>

      {problem.examples?.map((ex, i) => (
        <div className="problem-section" key={i}>
          <h3>Example {i + 1}</h3>
          <div className="example-box">
            <p><strong>Input:</strong> {ex.input}</p>
            <p><strong>Output:</strong> {ex.output}</p>
            {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
          </div>
        </div>
      ))}

      {problem.hints?.length > 0 && (
        <div className="problem-section">
          <h3 className="hint-heading">Hints</h3>
          <ul>
            {problem.hints.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}