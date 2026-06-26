import { useState, useRef } from "react";
import {
  FileText, Gauge, Search, Briefcase, MessageSquare,
  BarChart3, UploadCloud, Sparkles, ShieldCheck,
} from "lucide-react";
import "./UploadResumePage.css"
import axiosInstance from "../../utils/axiosInstance";

import { useNavigate } from "react-router";
import { Loader2, X } from "lucide-react";  

const features = [
  {
    icon: Gauge,
    iconBg: "icon-purple",
    num: "01",
    numBg: "num-purple",
    title: "ATS Score & Analysis",
    desc: "Get your resume scored based on ATS compatibility and industry standards.",
  },
  {
    icon: Search,
    iconBg: "icon-green",
    num: "02",
    numBg: "num-green",
    title: "Missing Keywords",
    desc: "Find important keywords that are missing from your resume.",
  },
  {
    icon: Briefcase,
    iconBg: "icon-orange",
    num: "03",
    numBg: "num-orange",
    title: "Skills Detection",
    desc: "Automatically detect your skills and get match percentage for the job role.",
  },
  {
    icon: MessageSquare,
    iconBg: "icon-blue",
    num: "04",
    numBg: "num-blue",
    title: "AI Feedback & Suggestions",
    desc: "Get AI-powered suggestions to improve content, structure and readability.",
  },
  {
    icon: BarChart3,
    iconBg: "icon-pink",
    num: "05",
    numBg: "num-pink",
    title: "Detailed Insights",
    desc: "In-depth section analysis with strengths, weaknesses and improvement tips.",
  },
];

export default function UploadResumePage() {
    const navigate = useNavigate();
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
    const [analyzing, setAnalyzing] = useState(false); 

  const handleFile = (file) => {
    if (file) setFileName(file.name);
    setFile(file);
  };

   const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };


  const handleAnalyze = async () => {
  if (!file) return;
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("resume", file); // ✅ backend field name
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/resume/analyse", {
        state: { 
          fileName, 
          analysis: response.data.analysis // ✅ analysis data pass karo
        }
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setAnalyzing(false);
    }
};

return (
    <div className="ra-page">
      <div className="ra-header">
        <div className="ra-header-left">
          <div className="ra-logo">
            <FileText size={20} />
          </div>
          <h1>Resume Analyzer</h1>
        </div>
        <div className="ra-badge">
          <Sparkles size={14} />
          AI Powered • ATS Optimized
        </div>
      </div>

      <div className="ra-content">

        {/* LEFT — UPLOAD */}
        <div className="ra-upload-col">
          <h2>Upload Your Resume</h2>
          <p className="ra-sub">Upload your resume and get instant analysis</p>

          <div
            className={`ra-dropzone ${dragActive ? "active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="ra-upload-icon">
              <FileText size={30} />
              <span className="ra-upload-arrow">
                <UploadCloud size={16} />
              </span>
            </div>

            {!fileName ? (
  <>
    <h3>Drag &amp; Drop your resume here</h3>
    <span className="ra-or">or</span>
    <button className="ra-upload-btn" onClick={() => inputRef.current.click()}>
      <UploadCloud size={16} />
      Upload Resume
    </button>
  </>
) : (
  <>
    <h3>Resume Uploaded</h3>
    <div className="ra-file-chip">
      <FileText size={14} />
      <span>{fileName}</span>
      <button className="ra-file-remove" onClick={() => setFileName(null)}>
        <X size={14} />
      </button>
    </div>
    <button className="ra-analyze-btn" onClick={handleAnalyze} disabled={analyzing}>
      {analyzing ? (
        <>
          <Loader2 size={16} className="spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles size={16} />
          Analyze Resume
        </>
      )}
    </button>
  </>
)}

<input
  ref={inputRef}
  type="file"
  accept=".pdf,.docx"
  hidden
  onChange={(e) => handleFile(e.target.files[0])}
/>

            {fileName && <p className="ra-filename">📄 {fileName}</p>}

            <p className="ra-formats">Supported formats: PDF, DOCX</p>
            <p className="ra-formats">Max file size: 5MB</p>
          </div>

          <div className="ra-steps-box">
            <p className="ra-steps-title">
              <Sparkles size={14} />
              Get your resume reviewed in 3 simple steps
            </p>
            <div className="ra-steps-row">
              <div className="ra-step active">
                <span className="ra-step-num">1</span>
                Upload Resume
              </div>
              <span className="ra-step-line" />
              <div className="ra-step">
                <span className="ra-step-num">2</span>
                AI Analysis
              </div>
              <span className="ra-step-line" />
              <div className="ra-step">
                <span className="ra-step-num">3</span>
                Get Insights
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — FEATURES */}
        <div className="ra-features-col">
          <h2 className="ra-features-heading">
            <span className="grad-text">Analyze. Improve.</span> Get Hired.
          </h2>
          <p className="ra-features-sub">
            Get a detailed ATS score, keyword insights, and AI-powered suggestions to make your resume stand out.
          </p>

          <div className="ra-feature-list">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div className="ra-feature-card" key={i}>
                  <div className={`ra-feature-icon ${f.iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <div className="ra-feature-text">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                  <span className={`ra-feature-num ${f.numBg}`}>{f.num}</span>
                </div>
              );
            })}
          </div>

          <p className="ra-secure">
            <ShieldCheck size={14} />
            Your data is 100% secure and confidential
          </p>
        </div>

      </div>
    </div>
  );
}