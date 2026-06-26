import "./CodingPage.css"
import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

import QuestionDescription from "./QuestionDescription";
import CodeEditor from "./CodeEditor";
import TestCases from "./TestCases";

export default function CodingPage({problem, onBack}) {
  
  const fetchStats = () => {
  axiosInstance.get("/submissions/my")
    .then(res => setStats(res.data))
    .catch(err => console.log(err));
};

useEffect(() => {
  fetchStats();
}, []);

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
          <CodeEditor problem={problem}
          onSubmitSuccess={fetchStats}/>
          <TestCases testCases={problem?.testCases || []}/>
        </div>

      </div>
    </div>
  );
}