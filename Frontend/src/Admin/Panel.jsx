import React from "react";
import AddProblem from "./AddProblem.jsx";
import ProblemList from "./ProblemList.jsx";
import AdminSidebar from "./AdminSidebar.jsx";
import { Routes, Route } from "react-router-dom";
const Panel = () => {
  return (
    <>
      <div className="admin-page">
        <AdminSidebar />

        <div className="content">
          <Routes>
            <Route path="/add-problem" element={<AddProblem />} />

            <Route path="/problems" element={<ProblemList />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Panel;
