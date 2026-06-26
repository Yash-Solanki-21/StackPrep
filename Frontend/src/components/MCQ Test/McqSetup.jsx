import React from 'react';
import {BookOpenCheck} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

import { useNavigate } from 'react-router';
import axiosInstance from '../../utils/axiosInstance.js';
import "./McqSetup.css";
import { useState, useEffect, useRef, useMemo } from 'react';
const topics = [
  "React",
  "JavaScript",
  "Node.js",
  "MongoDB",
  "Express",
  "Redux",
  "Next.js",
  "HTML",
  "CSS",
  "TypeScript"
];

export default function MCQSetup() {

const [testHistory, setTestHistory] = useState([]);
const [statsLoading, setStatsLoading] = useState(true);

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get("/mcq/my-results");
      setTestHistory(response.data.tests || []);
    } catch (error) {
      console.error("History fetch failed:", error);
    } finally {
      setStatsLoading(false);
    }
  };
  fetchHistory();
}, []);


const last5 = useMemo(() => [...testHistory].slice(0, 5).reverse(), [testHistory]);
const avgAccuracy = useMemo(() => last5.length ? Math.round(last5.reduce((sum, t) => sum + t.percentage, 0) / last5.length) : 0, [last5]);
const bestScore = useMemo(() => last5.length ? Math.max(...last5.map((t) => t.percentage)) : 0, [last5]);
const chartData = useMemo(() => last5.map((test, idx) => ({ name: `T${idx + 1}`, score: test.percentage, topic: test.topic || 'Mixed' })), [last5]);


  const [difficulty, setDifficulty] = useState("Medium");
const [totalQuestions, setTotalQuestions] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
const [selectedTopics, setSelectedTopics] = useState([]);

  const [duration, setDuration] = useState(20);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  
  const filteredTopics = topics.filter(
  (topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTopics.includes(topic)
);

const dropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSearchTerm(""); 
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const addTopic = (topic) => {
  setSelectedTopics([...selectedTopics, topic]);
  setSearchTerm("");
};

const removeTopic = (topic) => {
  setSelectedTopics(
    selectedTopics.filter((item) => item !== topic)
  );
};

const handleQuestionChange = (e) => {
  let num = Number(e.target.value);
  if (num > 20) num = 20;   
  if (num < 1) num = 1;   
  setTotalQuestions(num);
};

const handleTimeChange = (e) => {
  let value = Number(e.target.value);
  if (value > 30) value = 30;
  if (value < 1) value = 1;
  setDuration(value);
};

const handleStartAssessment = async () => {
  if (selectedTopics.length === 0) {
    alert("Select at least one topic");
    return;
  }
  if (totalQuestions < 1 || totalQuestions > 20) {
    alert("Questions must be between 1 and 20");
    return;
  }
      setLoading(true);

  try {
    const response = await axiosInstance.post("/mcq/generate",
      {
        topics: selectedTopics,
        difficulty,
        totalQuestions
      }
    );
    const mcqs = response.data.mcqs;

    sessionStorage.removeItem("mcq_timeLeft");
    sessionStorage.setItem("mcq_questions", JSON.stringify(mcqs));

     sessionStorage.setItem(
  "mcq_questions",
  JSON.stringify(mcqs)
);
      navigate("/mcq/test", {
      state: { mcqs, duration }
    });

  } catch (error) {
    console.log("ERROR:", error.response?.data);
    console.log("FULL:", error);
  }
  finally {
    setLoading(false);
  }
};

  if (loading) {
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
          <p className="ai-heading">AI is preparing your assessment</p>
          <p className="ai-sub">Please wait a moment...</p>
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
    <div className="dashboard-container">
      
      <div className="main-content-area"> 
        <h1 className="main-dashboard-heading"><BookOpenCheck size={40} color='white'/>Assessment</h1>
        <div className="dashboard-grid">
          
          <div className="card card-setup">
            <div className="setup-top">
              <h2 className="setup-title">Practice & Improve 🎯</h2>
              <p className="setup-subtitle"> Choose your topics, set difficulty, and challenge yourself with AI-generated questions tailored just for you.</p>

                <div className="input-group">
           <label className="input-label">Assessment Topics</label>

               <div className="topic-selector" ref={dropdownRef}>

          <div className="selected-topics">
            {selectedTopics.map((topic) => (
          <div key={topic} className="topic-chip">
          {topic}
          <span
            className="remove-topic"
            onClick={() => removeTopic(topic)}
          >
            ✕
           </span>
           </div>
            ))}
      </div>

      <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search topics..."
        className="topic-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="search-icon">🔍</span>
    </div>
        {searchTerm && filteredTopics.length > 0 && (
        <div className="topic-dropdown">
        {filteredTopics.map((topic) => (
          <div className="topic-item" 
          key={topic}
          onClick={() => addTopic(topic)}
          style={{ cursor: 'pointer' }}>
            <span>{topic}</span>
           
          </div>
        ))}
           </div>
          )}
            </div>
      </div>

              <div className="input-group">
                <label className="input-label">Difficulty</label>
                <div className="difficulty-toggle">

                  <button className={`toggle-btn ${difficulty === "Easy" ? "active" : ""}`}
                  onClick={() => setDifficulty("Easy")}>Easy</button>
        
                  <button className={`toggle-btn ${difficulty === "Medium" ? "active" : ""}`}
                   onClick={() => setDifficulty("Medium")}>Medium</button>

                  <button className={`toggle-btn ${difficulty === "Hard" ? "active" : ""}`}
                  onClick={() => setDifficulty("Hard")}>Hard</button>
                </div>
              </div>

         
              <div className="input-row">
                <div className="input-group">
                  <label className="input-label">Questions</label>
                  <input className="form-input"
                   type="number"
                    value={totalQuestions}
                    onChange={handleQuestionChange} />
                </div>

                <div className="input-group">
                  <label className="input-label">Duration (min)</label>
                  <select
                     className="form-input"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                        >
                      
                  <option value={5}>5 min</option>  
                  <option value={10}>10 min</option>
                   <option value={15}>15 min</option>
                    <option value={20}>20 min </option>
                    <option value={30}>30 min </option>
                  </select>
                </div>
              </div>
            </div>
          

            <button className="btn-primary" onClick={handleStartAssessment}>
              Start assessment <span className="btn-arrow">→</span>
            </button>
          </div>

          <div className="card card-accuracy">
  <h3 className="card-heading text-center">Average Accuracy</h3>

  <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
    <RadialBarChart
      width={180}
      height={180}
      cx={90}
      cy={90}
      innerRadius={60}
      outerRadius={80}
      barSize={25}
      data={[{ value: avgAccuracy }]}
      startAngle={90}
      endAngle={-270}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, 100]}
        angleAxisId={0}
        tick={false}
      />
      <RadialBar
        background={{ fill: 'rgba(109,98,229,0.15)' }}
        dataKey="value"
        angleAxisId={0}
        fill="#6d62e5"
        cornerRadius={10}
        
      />
    </RadialBarChart>

    {/* Center text */}
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: '#ffffff' }}>
        {statsLoading ? '...' : `${avgAccuracy}%`}
      </div>
      <div style={{ fontSize: 15, color: '#9ca3af' }}>accuracy</div>
    </div>
  </div>

  <div className="pulse-badge">
    <span className="pulse-dot"></span>
    {avgAccuracy >= 80 ? 'Great job! Keep it up' : avgAccuracy >= 50 ? 'Good progress!' : 'Keep practicing!'}
  </div>
          </div>

          <div className="stats-column">
        
            <div className="mini-card">
              <div className="mini-card-left">
                <div className="icon-box">📋</div>
                <div>
                  <p className="mini-card-label">Total tests</p>
                  <h4 className="mini-card-value">
                    {testHistory.length}
                  </h4>
                </div>
              </div>
              
            </div>

            <div className="mini-card">
              <div className="mini-card-left">
                <div className="icon-box">📈</div>
                <div>
                  <p className="mini-card-label">Average score</p>
                  <h4 className="mini-card-value">{avgAccuracy}</h4>
                </div>
              </div>
              
            </div>

            {/* Best Score Card */}
            <div className="mini-card">
              <div className="mini-card-left">
                <div className="icon-box">🏆</div>
                <div>
                  <p className="mini-card-label">Best score</p>
                  <h4 className="mini-card-value">{bestScore}</h4>
                </div>
              </div>
              
            </div>
          </div>

         <div className="card card-chart">
  <div className="chart-header">
    <div>
      <h3 className="card-heading text-left">Last 5 tests</h3>
      <p className="chart-subtitle">Score out of 100</p>
    </div>
  </div>

  {last5.length === 0 ? (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '180px',
      color: '#9ca3af',
      fontSize: '13px'
    }}>
      No tests yet — give your first test!
    </div>
  ) : (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={last5.map((test, idx) => ({
          name: `T${idx + 1}`,
          score: test.percentage,
          topic: test.topic || 'Mixed',
        }))}
       
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
         barCategoryGap="20%"
         
  
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(156,163,175,0.2)"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: 'white', fontSize: 15, }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fill: 'white', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(109,98,229,0.08)' }}
          contentStyle={{
            background: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
          }}
          labelStyle={{ color: '#fff', fontWeight: 600 }}
          formatter={(value, name, props) => [
            `${value}%`,
            props.payload.topic,
          ]}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={50}
          minPointSize={5}>
          <LabelList
    dataKey="score"
    position="top"
    style={{ fill: 'white', fontSize: 12 }}
    formatter={(val) => `${val}%`}
  />
          {last5.map((test, idx) => (
            <Cell
              key={idx}
              fill={test.percentage === bestScore ? '#6d62e5' : '#4f46e5'}
              opacity={test.percentage === bestScore ? 1 : 0.65}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

        </div>
      </div>
    </div>
  );
}