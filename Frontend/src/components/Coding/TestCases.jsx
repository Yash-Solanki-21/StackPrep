import { useState } from "react";
import "./TestCases.css";



export default function TestCases({ testCases }) {
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false); 


  if (!testCases.length) {
  return (
    <div className="tc-wrapper">
      <p>No test cases available</p>
    </div>
  );
}

  return (
    <div className={`tc-wrapper ${isOpen ? "open" : "closed"}`}>
      
      <div className="tc-topbar">
        
        {isOpen && (
          <div className="tc-tabs">
            {testCases.map((tc, i) => (
              <button
                key={tc.id}
                className={`tc-tab ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                Case {tc.id}
              </button>
            ))}
          </div>
        )}

        <button className="tc-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Tastcase ▼" : "Tastcase ▲"}
        </button>

      </div>

      <div className="tc-block">
  <label>Input</label>
  <pre>{testCases[active].input}</pre>
</div>

<div className="tc-block">
  <label>Expected Output</label>
  <pre>{testCases[active].expectedOutput}</pre>
</div>

    </div>
  );
}