import "./CodingPage.css"

import QuestionDescription from "./QuestionDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";

export default function CodingPage({problem, onBack}) {
  
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
          onBack={onBack}/>
        </div>

        <div className="right-panel">
          <CodeEditor problem={problem}/>
          <TestCases testCases={problem?.testCases || []}/>
        </div>

      </div>
    </div>
  );
}