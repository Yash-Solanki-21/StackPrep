import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import "./Profile.css";
import { User, Mail, LogOut, ShieldCheck, Zap, Award, ArrowLeft } from "lucide-react";

export default function Profile({ onBack, setIsAuthenticated }) {

    const navigate = useNavigate();
 const [user, setUser] = useState(null);
useEffect(() => {
  axiosInstance
    .get("/user/profile")
    .then((res) => {
      setUser(res.data.user);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

const handlePayment = () => {
  const options = {
    key: "rzp_test_T6AoxsElpRR8uh",
    amount: "₹499",
    currency: "INR",
    name: "CodeCrack",
    description: "Pro Membership",
    handler: function (response) {
      toast.success("Payment Successful ✅")
    },

    theme: {
      color: "#6d62e5",
    },
  };
  const razor = new window.Razorpay(options);
  razor.open();
};

  const handleLogoutClick = async () => {
    try {  
      const res = await axiosInstance.post("/user/logout"); 
      if (res.data.success) {
        console.log("Logout successful on backend");
        localStorage.removeItem("token"); 
        localStorage.removeItem("user");
        if (setIsAuthenticated) {
          setIsAuthenticated(false);
        }
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      {/* HEADER SECTION */}
      <header className="profile-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <span className="profile-brand">Stack<span className="accent-text">Prep</span> profile</span>
      </header>

      {/* MAIN CONTAINER */}
      <main className="profile-main">
        
        {/* LEFT COLUMN: USER INFO CARD */}
        <section className="profile-card user-info-panel">
          <div className="profile-avatar-large">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="user-details">
            <div className="info-field">
              <User size={20} className="field-icon" />
              <div>
                <label>Full Name</label>
                <p>{user?.username}</p>
              </div>
            </div>

            <div className="info-field">
              <Mail size={20} className="field-icon" />
              <div>
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>

          {/* LOGOUT BUTTON AT THE BOTTOM OF LEFT CARD */}
          <button className="logout-btn" onClick={handleLogoutClick}>
            <LogOut size={16} />
            Logout Account
          </button>
        </section>

        {/* RIGHT COLUMN: PLANS & MEMBERSHIPS */}
        <section className="profile-card plans-panel">
          <div className="plans-header">
            <span className="panel-eyebrow">membership plans</span>
            <h2>Manage Your Plan</h2>
          </div>

          {/* ACTIVE PLAN DISPLAY */}
          <div className="active-plan-card">
            <div className="plan-badge">
              <ShieldCheck size={16} /> Active Plan
            </div>
            <div className="plan-info">
              <h3>Current Plan</h3>
              <p>Your subscription will automatically renew on Jan 2027.</p>
            </div>
          </div>

          {/* AVAILABLE PLANS OPTIONS */}
          <div className="plans-options-grid">
            <div className="plan-option-box disabled">
              <div className="plan-option-meta">
                <Award size={18} className="plan-icon-free" />
                <div>
                  <h4>Free Starter</h4>
                  <p>Basic DSA tracking & 5 MCQs/day</p>
                </div>
              </div>
              <span className="plan-price">Current</span>
            </div>

            <div className="plan-option-box premium-border">
              <div className="plan-option-meta">
                <Zap size={18} className="plan-icon-pro" />
                <div>
                  <h4>Elite Premium</h4>
                  <p>Unlimited ATS analysis & expert code reviews</p>
                </div>
              </div>
              <button className="upgrade-btn" onClick={handlePayment}>Upgrade</button>
            </div>
          </div>
        </section>

      </main>

      {/* MINIMAL FOOTER */}
      <footer className="profile-footer">
        <span>© 2026 codecrack • secure dashboard</span>
        <div className="footer-links">
          <span>privacy policy</span>
          <span>terms of service</span>
        </div>
      </footer>
    </div>
  );
}