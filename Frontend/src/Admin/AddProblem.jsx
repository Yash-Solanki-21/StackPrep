import "./AddProblem.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Sidebar from "./AdminSidebar.jsx";

export default function AddProblem() {
  const validate = () => {
    if (!title.trim()) {
      return "Title is required";
    }

    if (!description.trim()) {
      return "Description is required";
    }

    // Examples Validation
    for (let i = 0; i < examples.length; i++) {
      if (!examples[i].input.trim()) {
        return `Example ${i + 1} input is required`;
      }

      if (!examples[i].output.trim()) {
        return `Example ${i + 1} output is required`;
      }

      if (!examples[i].explanation.trim()) {
        return `Example ${i + 1} explanation is required`;
      }
    }

    // Test Cases Validation
    for (let i = 0; i < testCases.length; i++) {
      if (!testCases[i].input.trim()) {
        return `Test Case ${i + 1} input is required`;
      }

      if (!testCases[i].expectedOutput.trim()) {
        return `Test Case ${i + 1} output is required`;
      }
    }

    // Hints Validation
    for (let i = 0; i < hints.length; i++) {
      if (!hints[i].trim()) {
        return `Hint ${i + 1} cannot be empty`;
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      return alert(error);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/problems/`,
        {
          title,
          description,
          difficulty,
          tags,
          hints,
          examples,
          testCases,
          starterCode,
        },
      );

      console.log(response.data);
      alert("Problem Added Successfully");

      setTitle("");
      setDescription("");
      setDifficulty("Easy");
      setTags([]);

      setExamples([
        {
          input: "",
          output: "",
          explanation: "",
        },
        {
          input: "",
          output: "",
          explanation: "",
        },
      ]);
      setHints([""]);
      setTestCases([
        {
          input: "",
          expectedOutput: "",
        },
        {
          input: "",
          expectedOutput: "",
        },
      ]);
      setStarterCode("");
    } catch (error) {
      console.log(error);
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState([]);
  const [examples, setExamples] = useState([
    {
      input: "",
      output: "",
      explanation: "",
    },
    {
      input: "",
      output: "",
      explanation: "",
    },
  ]);

  const [starterCode, setStarterCode] = useState("");
  const [hints, setHints] = useState([""]);
  const [testCases, setTestCases] = useState([
    {
      input: "",
      expectedOutput: "",
    },
    {
      input: "",
      expectedOutput: "",
    },
  ]);

  const addHint = () => {
    setHints([...hints, ""]);
  };

  const removeHint = (index) => {
    if (hints.length === 1) return;
    const updatedHints = hints.filter((_, i) => i !== index);
    setHints(updatedHints);
  };

  const updateHint = (index, value) => {
    const updatedHints = [...hints];
    updatedHints[index] = value;
    setHints(updatedHints);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const removeTestCase = (index) => {
    if (testCases.length === 2) return;
    const updated = testCases.filter((_, i) => i !== index);
    setTestCases(updated);
  };
  const updateTestCase = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const updateExample = (index, field, value) => {
    const updated = [...examples];
    updated[index][field] = value;
    setExamples(updated);
  };

  return (
    <>
      {/* <div className="admin-page"> */}

      <main className="content">
        <div className="top-header">
          <h1>Add New Question</h1>
        </div>

        <div className="form-group">
          <label>Question Title</label>

          <input
            type="text"
            placeholder="e.g. Two Sum, Valid Parentheses..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Difficulty</label>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label>Topic / Category</label>

            <select onChange={(e) => setTags([e.target.value])}>
              <option value="Arrays">Arrays</option>
              <option value="Strings">Strings</option>
              <option value="Graph">Graph</option>
              <option value="DP">DP</option>
              <option value="Hash Mapping">Hash Mapping</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Problem Description</label>

          <textarea
            rows="5"
            placeholder="Describe the problem clearly..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="section">
          <h3>Example 1 — Input & Output</h3>

          <div className="grid-2">
            <input
              placeholder="nums = [2,7,11], target = 9"
              value={examples[0].input}
              onChange={(e) => updateExample(0, "input", e.target.value)}
            />

            <input
              placeholder="[0,1]"
              value={examples[0].output}
              onChange={(e) => updateExample(0, "output", e.target.value)}
            />
          </div>

          <textarea
            placeholder="Explanation"
            value={examples[0].explanation}
            onChange={(e) => updateExample(0, "explanation", e.target.value)}
          />
        </div>

        <div className="section">
          <h3>Example 2 — Input & Output</h3>

          <div className="grid-2">
            <input
              placeholder="nums = [3,2,4], target = 6"
              value={examples[1].input}
              onChange={(e) => updateExample(1, "input", e.target.value)}
            />
            <input
              placeholder="[1,2]"
              value={examples[1].output}
              onChange={(e) => updateExample(1, "output", e.target.value)}
            />
          </div>
        </div>

        <textarea
          placeholder="Explanation"
          value={examples[1].explanation}
          onChange={(e) => updateExample(1, "explanation", e.target.value)}
        />

        <div className="section">
          <h3>🔒 Hidden Test Cases</h3>

          {testCases.map((testCase, index) => (
            <div className="test-row" key={index}>
              <input
                placeholder="Input"
                value={testCase.input}
                onChange={(e) => updateTestCase(index, "input", e.target.value)}
              />

              <input
                placeholder="Output"
                value={testCase.expectedOutput}
                onChange={(e) =>
                  updateTestCase(index, "expectedOutput", e.target.value)
                }
              />

              <button
                className="remove-btn"
                onClick={() => removeTestCase(index)}
                disabled={testCases.length === 2}
              >
                {" "}
                ✕{" "}
              </button>
            </div>
          ))}

          <button className="outline-btn" onClick={addTestCase}>
            + Add Test Case
          </button>
        </div>

        <div className="section">
          <h3>💡 Hints</h3>

          {hints.map((hint, index) => (
            <div className="hint-row" key={index}>
              <textarea
                type="text"
                value={hint}
                placeholder={`Hint ${index + 1}`}
                onChange={(e) => updateHint(index, e.target.value)}
              />

              <button
                className="remove-btn"
                onClick={() => removeHint(index)}
                disabled={hints.length === 1}
              >
                ✕
              </button>
            </div>
          ))}

          <button className="outline-btn" onClick={addHint}>
            + Add Hint
          </button>
        </div>
        <div className="footer-actions">
          <button className="publish-btn" onClick={handleSubmit}>
            Publish Problem
          </button>
        </div>
      </main>
      {/* </div> */}
    </>
  );
}
