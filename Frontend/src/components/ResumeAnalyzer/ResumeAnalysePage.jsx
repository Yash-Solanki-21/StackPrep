import "./ResumeAnalysePage.css";
import { useNavigate, useLocation } from "react-router";
import { RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  ArrowLeft, Download, AlertCircle, ShieldCheck,
  Target, Zap, TrendingUp, Award, BookOpen, Code2, Briefcase,
} from "lucide-react";

// ── Hardcoded fallback data ──────────────────────────────
const MOCK = {
  atsScore: 82,
  strengths: ["Strong project section", "ATS-friendly format", "Clear technical skills", "Good education section"],
  weaknesses: ["Missing cloud keywords", "No measurable achievements", "Summary too generic"],
  missingKeywords: ["Docker", "AWS", "TypeScript", "CI/CD", "Redis", "Kubernetes", "GraphQL"],
  suggestions: [
    "Add quantifiable achievements (e.g. 'reduced load time by 40%')",
    "Include Docker and AWS in your skills section",
    "Write a stronger professional summary",
    "Add CI/CD pipeline experience",
  ],
  sectionScores: [
    { section: "Skills", score: 90 },
    { section: "Projects", score: 95 },
    { section: "Education", score: 88 },
    { section: "Experience", score: 75 },
    { section: "Summary", score: 60 },
  ],
};

const SECTION_COLORS = ["#6d62e5", "#22d3a5", "#f59e0b", "#ef4444", "#a78bfa"];

export default function ResumeAnalysePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fileName, analysis } = location.state || {};

  const data = analysis || MOCK;
  const atsScore     = data.atsScore        || 0;
  const strengths    = data.strengths       || [];
  const weaknesses   = data.weaknesses      || [];
  const missingKw    = data.missingKeywords || [];
  const suggestions  = data.suggestions    || [];
  const sections     = data.sectionScores  || MOCK.sectionScores;

  const scoreColor =
    atsScore >= 80 ? "#22d3a5" :
    atsScore >= 60 ? "#f59e0b" : "#ef4444";

  const scoreLabel =
    atsScore >= 80 ? "Excellent" :
    atsScore >= 60 ? "Good" : "Needs Work";

  const radialData = [{ value: atsScore }];
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="rap-page">

      {/* ── Header ── */}
      <div className="rap-header">
        <div className="rap-header-left">
          <button className="rap-back-btn" onClick={() => navigate("/resume")}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="rap-title">Resume Analysis Report</h1>
            <p className="rap-subtitle">{fileName || "resume.pdf"} • ATS Score & Optimization Insights</p>
          </div>
        </div>
        <button className="rap-download-btn">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* ── Main grid ── */}
      <div className="rap-grid">

        {/* ATS Score — big card */}
        <div className="rap-card rap-ats-card">
          <div className="rap-ats-inner">
            <div className="rap-radial-wrap">
              <RadialBarChart
                width={180} height={180}
                cx={90} cy={90}
                innerRadius={58} outerRadius={78}
                barSize={16}
                data={radialData}
                startAngle={90} endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: "rgba(255,255,255,0.07)" }}
                  dataKey="value"
                  angleAxisId={0}
                  fill={scoreColor}
                  cornerRadius={8}
                />
              </RadialBarChart>
              <div className="rap-radial-center">
                <span className="rap-score-num" style={{ color: scoreColor }}>{atsScore}</span>
                <span className="rap-score-denom">/100</span>
              </div>
            </div>
            <div className="rap-ats-info">
              <span className="rap-ats-label" style={{ background: `${scoreColor}22`, color: scoreColor }}>
                {scoreLabel}
              </span>
              <h2>ATS Score</h2>
              <p>Your resume scores <strong>{atsScore}/100</strong> on ATS compatibility. {atsScore >= 80 ? "Great job — most ATS systems will pass this resume." : "Improve keyword coverage to boost your score."}</p>
              <div className="rap-score-bar-wrap">
                <div className="rap-score-bar">
                  <div className="rap-score-bar-fill" style={{ width: `${atsScore}%`, background: scoreColor }} />
                </div>
                <span style={{ color: scoreColor }}>{atsScore}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Scores — bar chart */}
        <div className="rap-card">
          <div className="rap-card-header">
            <TrendingUp size={18} className="rap-card-icon" />
            <h3>Section Scores</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={sections} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barSize={28}>
              <XAxis dataKey="section" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1a1830", border: "none", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#fff" }}
                formatter={(v) => [`${v}%`]}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {sections.map((_, i) => (
                  <Cell key={i} fill={SECTION_COLORS[i % SECTION_COLORS.length]} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Missing Keywords */}
        <div className="rap-card">
          <div className="rap-card-header">
            <Code2 size={18} className="rap-card-icon" />
            <h3>Missing Keywords</h3>
          </div>
          <p className="rap-card-desc">Add these to boost your ATS match rate</p>
          <div className="rap-tags">
            {missingKw.map((kw, i) => (
              <span key={i} className="rap-tag">{kw}</span>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="rap-card">
          <div className="rap-card-header">
            <Award size={18} className="rap-card-icon rap-icon-green" />
            <h3>Resume Strengths</h3>
          </div>
          <div className="rap-list">
            {strengths.map((s, i) => (
              <div key={i} className="rap-list-item rap-list-good">
                <ShieldCheck size={16} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="rap-card">
          <div className="rap-card-header">
            <AlertCircle size={18} className="rap-card-icon rap-icon-red" />
            <h3>Weaknesses</h3>
          </div>
          <div className="rap-list">
            {weaknesses.map((w, i) => (
              <div key={i} className="rap-list-item rap-list-bad">
                <AlertCircle size={16} />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="rap-card rap-suggestions-card">
          <div className="rap-card-header">
            <Zap size={18} className="rap-card-icon rap-icon-amber" />
            <h3>AI Suggestions</h3>
          </div>
          <div className="rap-suggestions">
            {suggestions.map((tip, i) => (
              <div key={i} className="rap-suggestion-item">
                <span className="rap-suggestion-num">{String(i + 1).padStart(2, "0")}</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rap-card rap-summary-card">
          <div className="rap-card-header">
            <BookOpen size={18} className="rap-card-icon" />
            <h3>Overall Summary</h3>
          </div>
          <div className="rap-summary-body">
            <Target size={36} className="rap-summary-icon" />
            <p>
              {atsScore >= 80
                ? "Strong resume with solid project experience and ATS compatibility. Adding cloud and DevOps keywords will further improve matching with modern JDs."
                : atsScore >= 60
                ? "Good foundation but needs keyword optimization. Focus on measurable achievements and adding missing technical skills."
                : "Resume needs significant improvement. Restructure sections, add relevant keywords, and quantify your impact to pass ATS filters."}
            </p>
          </div>
          <div className="rap-summary-stats">
            <div>
              <span>{strengths.length}</span>
              <p>Strengths</p>
            </div>
            <div>
              <span>{weaknesses.length}</span>
              <p>Weaknesses</p>
            </div>
            <div>
              <span>{missingKw.length}</span>
              <p>Missing KW</p>
            </div>
            <div>
              <span>{suggestions.length}</span>
              <p>Tips</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}