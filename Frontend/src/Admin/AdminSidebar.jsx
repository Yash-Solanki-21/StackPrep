import React from 'react'
import axios from 'axios';
import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import "./AdminSidebar.css"

const AdminSidebar = () => {

  const [stats, setStats] = useState({
  totalQuestions: 0,
  easyQuestions: 0,
  mediumQuestions: 0,
  hardQuestions: 0,
});

const fetchStats = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/problems/stats`
    );

    setStats(res.data);
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  fetchStats();
}, []);

const navigate = useNavigate();
const [activeTab, setActiveTab] = useState("add");
  return (
    <>
         <aside className="admin-sidebar">
        <h2 className="admin-logo">ADMIN PANEL</h2>
        <div className="admin-menu">
          <button className={`admin-menu-item ${activeTab === "add" ? "active" : ""}`}
            onClick={()=>{
              setActiveTab("add");
              navigate("/admin/add-problem")
            }}
          >
            + Add Question
          </button>

          <button className={`admin-menu-item ${activeTab === "problems" ? "active" : ""}`}
            onClick={()=>{
              setActiveTab("problems");
              navigate("/admin/problems")
            }}
            >
            ☰ All Questions
            <span className="admin-badge">{stats.totalQuestions}</span>
          </button>

        </div>

        <div className="difficulty-box">
          <h4>Questions by Difficulty</h4>

          <div className="difficulty-row">
            <span className="easy">Easy</span>
            <span>{stats.easyQuestions}</span>
          </div>

          <div className="difficulty-row">
            <span className="medium">Medium</span>
            <span>{stats.mediumQuestions}</span>
          </div>

          <div className="difficulty-row">
            <span className="hard">Hard</span>
            <span>{stats.hardQuestions}</span>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar;