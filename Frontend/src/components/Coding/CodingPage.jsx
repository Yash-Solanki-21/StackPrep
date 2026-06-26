import "./CodingPage.css"
import QuestionDescription from "./QuestionDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";
import toast from "react-hot-toast";

export default function CodingPage({ problem, onBack, refreshStats }) {

  // This callback function runs AFTER CodeEditor saves everything to the database
  const handleAfterSubmit = () => {
    // If you pass down a function to refresh dashboards from ProblemPage
    if (typeof refreshStats === "function") {
      refreshStats(); 
    }
  };

  return (
    <div className="question-detail-page">
      <button
        className="back-btn"
        onClick={onBack}
      >
        ← Back to problem
      </button>
      <div className="top-section">

        <div className="left-panel">
          <QuestionDescription  
            problem={problem}
            onBack={onBack}
          />
        </div>

        <div className="right-panel">
          <CodeEditor 
            problem={problem}
            onSubmitSuccess={handleAfterSubmit} 
          />
          <TestCases testCases={problem?.testCases || []} />
        </div>

      </div>
    </div>
  );
}