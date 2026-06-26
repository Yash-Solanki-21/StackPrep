import "./ProblemPage.css";
import { FiSearch } from "react-icons/fi";
import {
  CheckCircle2, Circle, ChevronRight,
  Code2, Target, TrendingUp, Zap, BookOpen,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState, useMemo } from "react";
import {
  RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const DIFF_COLOR = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };

export default function ProblemPage({ onSelectProblem }) {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [activeId, setActiveId] = useState(null);

  // Backend /submissions/my returns { totalSolved, easy, medium, hard }
  const [stats, setStats] = useState({ totalSolved: 0, easy: 0, medium: 0, hard: 0 });

  // Backend /problems/stats returns { totalQuestions, easyQuestions, mediumQuestions, hardQuestions }
  const [problemStats, setProblemStats] = useState({
    totalQuestions: 0, easyQuestions: 0, mediumQuestions: 0, hardQuestions: 0,
  });

  const handleClick = async (p) => {
    setActiveId(p._id);
    try {
      const res = await axiosInstance.get(`/problems/${p._id}`);
      onSelectProblem(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch solved stats directly — no submissions array needed
useEffect(() => {
  axiosInstance.get("/submissions/my")
    .then(res => {
      setStats(res.data);
    })
    .catch(err => console.log(err));
}, []);

 useEffect(() => {
  axiosInstance.get("/problems/stats")
    .then(res => {
      setProblemStats(res.data);
    })
    .catch(err => console.error(err));
}, []);

  useEffect(() => {
    axiosInstance.get("/problems")
      .then(res => setProblems(Array.isArray(res.data) ? res.data : res.data?.problems ?? []))
      .catch(err => console.error("fetchProblems error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    problems.filter(p =>
      (filter === "All" || p.difficulty === filter) &&
      p.title.toLowerCase().includes(search.toLowerCase())
    ), [problems, filter, search]);

  const total      = problemStats.totalQuestions;
  const solved     = stats.totalSolved;
  const pct        = total > 0 ? Math.round((solved / total) * 100) : 0;
  const scoreColor = pct >= 75 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#6d62e5";

  const barData = [
    { name: "Easy",   solved: stats.easy,   total: problemStats.easyQuestions   },
    { name: "Medium", solved: stats.medium, total: problemStats.mediumQuestions  },
    { name: "Hard",   solved: stats.hard,   total: problemStats.hardQuestions    },
  ];

  if (loading) {
    return (
      <div className="cpp-loading">
        <div className="cpp-spinner" />
        <p>Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="cpp-page">

      {/* Heading */}
      <div className="cpp-heading-row">
        <div className="cpp-heading-left">
          <div className="cpp-heading-icon"><Code2 size={22} /></div>
          <div>
            <h1 className="cpp-heading">Coding Practice</h1>
            <p className="cpp-heading-sub">Sharpen your DSA skills, one problem at a time</p>
          </div>
        </div>
        <div className="cpp-streak-pill">
          <Zap size={15} color="#6d62e5" />
          {solved} / {total} Solved
        </div>
      </div>

      <div className="cpp-layout">

        {/* Left: problem list */}
        <div className="cpp-left">

          <div className="cpp-controls">
            <div className="cpp-search">
              <FiSearch size={15} />
              <input
                placeholder="Search problems..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="cpp-filters">
              {["All", "Easy", "Medium", "Hard"].map(d => (
                <button
                  key={d}
                  className={`cpp-filter-btn ${filter === d ? (d === "All" ? "cpp-filter-active-default" : "cpp-filter-active") : ""}`}
                  style={filter === d && d !== "All"
                    ? { background: DIFF_COLOR[d] + "22", color: DIFF_COLOR[d], borderColor: DIFF_COLOR[d] + "55" }
                    : {}}
                  onClick={() => setFilter(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="cpp-table-head">
            <span>#</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Status</span>
            <span></span>
          </div>

          <div className="cpp-table-body">
            {filtered.length === 0 && (
              <div className="cpp-empty">
                <BookOpen size={32} />
                <p>No problems found</p>
              </div>
            )}
            {filtered.map((p, i) => (
              <div
                key={p._id}
                className={`cpp-row ${activeId === p._id ? "cpp-row-active" : ""}`}
                onClick={() => handleClick(p)}
              >
                <span className="cpp-num">{i + 1}.</span>

                <span className="cpp-title-cell">
                  {p.isSolved
                    ? <CheckCircle2 size={15} className="cpp-icon-solved" />
                    : <Circle size={15} className="cpp-icon-unsolved" />
                  }
                  <span>{p.title}</span>
                </span>

                <span>
                  <span
                    className="cpp-diff-badge"
                    style={{
                      color: DIFF_COLOR[p.difficulty],
                      background: DIFF_COLOR[p.difficulty] + "18",
                      border: `1px solid ${DIFF_COLOR[p.difficulty]}33`,
                    }}
                  >
                    {p.difficulty}
                  </span>
                </span>

                <span>
                  {p.isSolved
                    ? <span className="cpp-status-solved">✓ Solved</span>
                    : <span className="cpp-status-unsolved">Unsolved</span>}
                </span>

                <span className="cpp-chevron-wrap"><ChevronRight size={15} /></span>
              </div>
            ))}
          </div>

          <p className="cpp-footer-count">
            Showing {filtered.length} of {problems.length} problems
            {solved > 0 && <span className="cpp-footer-solved"> · {solved} solved</span>}
          </p>
        </div>

        {/* Right: stats */}
        <div className="cpp-right">

          <div className="cpp-card">
            <h4 className="cpp-card-title"><Target size={16} /> Your Progress</h4>
            <div className="cpp-radial-wrap">
              <RadialBarChart
                width={160} height={160} cx={80} cy={80}
                innerRadius={52} outerRadius={70} barSize={14}
                data={[{ value: pct }]} startAngle={90} endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background={{ fill: "rgba(255,255,255,0.06)" }}
                  dataKey="value" angleAxisId={0}
                  fill={scoreColor} cornerRadius={7}
                />
              </RadialBarChart>
              <div className="cpp-radial-center">
                <span className="cpp-radial-pct" style={{ color: scoreColor }}>{pct}%</span>
                <span className="cpp-radial-sub">{solved}/{total}</span>
              </div>
            </div>
            <p className="cpp-progress-label">Problems Solved</p>
          </div>

          <div className="cpp-card">
            <h4 className="cpp-card-title"><TrendingUp size={16} /> Difficulty Breakdown</h4>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barSize={20}>
                <XAxis dataKey="name" tick={{ fill: "#858993", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#858993", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#161424", border: "none", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(v, n) => [v, n === "solved" ? "Solved" : "Total"]}
                />
                <Bar dataKey="total" radius={[4,4,0,0]} opacity={0.18}>
                  {barData.map((_, i) => <Cell key={i} fill={["#22c55e","#f59e0b","#ef4444"][i]} />)}
                </Bar>
                <Bar dataKey="solved" radius={[4,4,0,0]}>
                  {barData.map((_, i) => <Cell key={i} fill={["#22c55e","#f59e0b","#ef4444"][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="cpp-breakdown-list">
              {barData.map((b, i) => (
                <div key={b.name} className="cpp-breakdown-row">
                  <span style={{ color: ["#22c55e","#f59e0b","#ef4444"][i] }}>{b.name}</span>
                  <div className="cpp-breakdown-bar">
                    <div style={{
                      width: `${b.total ? (b.solved / b.total) * 100 : 0}%`,
                      background: ["#22c55e","#f59e0b","#ef4444"][i]
                    }} />
                  </div>
                  <span className="cpp-breakdown-count">{b.solved}/{b.total}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}