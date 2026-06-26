import React from 'react'
import "./ProblemList.css"
import axios from "axios"
import { useState, useEffect } from 'react';

const ProblemList = () => {

 const deleteProblem = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this problem?"
  );
  if (!confirmDelete) return;
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/v1/problems/${id}`
    );

    setProblems(
      problems.filter(
        (problem) => problem._id !== id
      )
    );

  } catch (error) {
    console.log(error);
  }
};

    const [problems, setProblems] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/problems/`
      );

      setProblems(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
   <>
          <div className="problem-list-page">

      <h1>All Problems</h1>
      <div className="problem-table">

        <div className="table-head">
          <span>Title</span>
          <span>Difficulty</span>
          <span>Action</span>
        </div>

        {problems.map((problem, index) => (
          <div
            className="table-row"
            key={problem._id}
          >
            <span className="problem-title">
             <span className="problem-number">
                 {index + 1}.
                    </span>
                    {problem.title}
                  </span>
            <span
  className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}
>
  {problem.difficulty}
</span>

            <button className="delete-btn"
            onClick={() => deleteProblem(problem._id)}>
              Delete
            </button>
          </div>
        ))}

      </div>

    </div>
   
   </>
  )
}

export default ProblemList