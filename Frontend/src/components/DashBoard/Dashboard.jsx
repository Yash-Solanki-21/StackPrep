import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Code2, ArrowRight, Brain, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const FEATURES = [
  "DSA problems — Easy to Hard",
  "Real interview-style MCQ rounds",
  "Instant compile & test feedback",
  "Track your accuracy & progress",
];

export default function Dashboard() {

  const navigate = useNavigate();

  const [userName, setUserName]         = useState("Coder");
  const [mcqCount, setMcqCount]         = useState(0);
  const [mcqAccuracy, setMcqAccuracy]   = useState(0);
  const [codingSolved, setCodingSolved] = useState(0);
  const [codingTotal, setCodingTotal]   = useState(45);

  useEffect(() => {
    // 1. User profile
    axiosInstance.get("/user/profile")
      .then(res => setUserName(res.data.user?.username || "Coder"))
      .catch(() => {});

    // 2. MCQ results
    axiosInstance.get("/mcq/my-results")
      .then(res => {
        const tests = res.data.tests || [];
        setMcqCount(tests.length);
        if (tests.length > 0) {
          const totalScore     = tests.reduce((sum, t) => sum + (t.score || 0), 0);
          const totalQuestions = tests.reduce((sum, t) => sum + (t.totalQuestions || 0), 0);
          setMcqAccuracy(totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0);
        }
      })
      .catch(() => {});

    // 3. Coding submissions
    axiosInstance.get("/submissions/my")
      .then(res => setCodingSolved(res.data.totalSolved || 0))
      .catch(() => {});

    // 4. Total problems
    axiosInstance.get("/problems/stats")
      .then(res => setCodingTotal(res.data.totalQuestions || 45))
      .catch(() => {});
  }, []);

  // Full ring — domain same as value so ring is always complete
  const mcqChartData    = [{ value: 100, fill: "#f59e0b" }];
  const codingChartData = [{ value: 100, fill: "#6d62e5" }];

  return (
    <div className="page">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <Code2 size={30} className="brand-icon" />
          <span className="brand-name">
            Stack<span className="accent-text">Prep</span>
          </span>
        </div>
        <p className="welcome">
          Welcome <span>{userName}</span>
        </p>
        <div className="avatar" onClick={() => navigate("/profile")}>
          <span>{userName[0]?.toUpperCase()}</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">

        {/* LEFT — intro */}
        <section className="intro">
          <span className="eyebrow">about StackPrep</span>
          <h1 className="title">
            Grab every<br />
            <span className="accent-text">opportunity.</span>
          </h1>
          <p className="description">
            Welcome to StackPrep — your all-in-one coding practice platform.Track your progress, solve curated DSA problems, attempt MCQs, and analyze your performance with real-time insights.
            Stay consistent, improve daily, and level up your coding journey with StackPrep environment built for developers.
          </p>
          <ul className="feature-list">
            {FEATURES.map(f => (
              <li key={f}>
                <CheckCircle size={13} className="feature-icon" />
                {f}
              </li>
            ))}
          </ul>
          <button className="cta" onClick={() => navigate("/mcq")}>
            start your journey <ArrowRight size={15} />
          </button>
        </section>

        {/* RIGHT — stats */}
        <section className="panels">

          {/* MCQ chart */}
          <div className="card">
            <span className="card-label">
              <Brain size={13} /> MCQ Tests Attempted
            </span>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="68%" outerRadius="100%"
                  data={mcqChartData}
                  startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.06)" }}
                    dataKey="value"
                    angleAxisId={0}
                    cornerRadius={6}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="chart-center">
                <span className="chart-value" style={{ color: "#f59e0b" }}>
                  {mcqCount}
                </span>
                <span className="chart-caption">
                  {mcqCount === 1 ? "test" : "tests"}
                </span>
              </div>
            </div>
            <p className="chart-sub">
              {mcqCount === 0
                ? "No tests taken yet"
                : `${mcqAccuracy}% overall accuracy`}
            </p>
          </div>

          {/* Coding chart */}
          <div className="card">
            <span className="card-label">
              <Code2 size={13} /> Problems Solved
            </span>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="68%" outerRadius="100%"
                  data={codingChartData}
                  startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "rgba(255,255,255,0.06)" }}
                    dataKey="value"
                    angleAxisId={0}
                    cornerRadius={6}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="chart-center">
                <span className="chart-value" style={{ color: "#6d62e5" }}>
                  {codingSolved}
                </span>
                <span className="chart-caption">/ {codingTotal}</span>
              </div>
            </div>
            <p className="chart-sub">
              {codingSolved === 0
                ? "No problems solved yet"
                : `${Math.round((codingSolved / codingTotal) * 100)}% completed`}
            </p>
          </div>

        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>© 2026 codecrack</span>
        <nav className="footer-nav">
          <span>problems</span>
          <span>mcq</span>
          <span>leaderboard</span>
        </nav>
      </footer>
    </div>
  );
}