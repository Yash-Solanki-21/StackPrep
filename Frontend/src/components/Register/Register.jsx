import "./Register.css";
import loginImage from "../../../public/assets/image.jpeg"
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");

   const navigate = useNavigate()

const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setPasswordError("");

  if (
    !formData.username.trim() ||
    !formData.email.trim() ||
    !formData.password.trim() ||
    !formData.confirmPassword.trim()
  ) {
    setError("All fields are required");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setPasswordError("Passwords do not match");
    return;
  }
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/register",
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      }
    );
    const data = response.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    toast.success("Registration Successful")
    navigate("/dashboard");
  } 
  
  catch (error) {
    const message =
    error.response?.data?.message || "Something went wrong";

  setError(message);

  if (message === "User already exist") {
    toast.error(message);
  }
  }
};
  return (
    <div className="register-auth-page">
      <div className="register-auth-card">
        <div className="register-auth-left">
          <h2>Start Your Journey</h2>
          <p>Create an account and start preparing smarter</p>
          <div className="register-illustration">
            <img src={loginImage} alt="register-illustration" />
          </div>
        </div>

        <div className="register-auth-right">
          <h3>Register to your account</h3>

          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label>Username</label>
              <input type="text" 
                placeholder="Enter your Username" 
                value={formData.username}
                onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
                }/>
            </div>

            <div className="register-form-group">
              <label>Email</label>
              <input 
                type="email"
                placeholder="Enter your email" 
                value={formData.email}
                onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
                }/>
            </div>

            <div className="register-form-group">
              <label>Password</label>
              <div className="register-password-field">
                <input type="password" 
                 placeholder="Enter your password" 
                  value={formData.password}
                  onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                 }/>
              </div>
            </div>
             <div className="register-form-group">
              <label>Confirm Password</label>
              <div className="register-password-field">
                <input type="password" 
                placeholder="Confirm password" 
                value={formData.confirmPassword}
                 onChange={(e) => 
        setFormData({...formData,confirmPassword: e.target.value,})}
          />

              {passwordError && (<p className="field-error">
                {passwordError}</p>)}

              </div>
            </div>

            {error && (
               <p className="form-error">
                       {error}
                </p>
              )}

            <button type="submit" className="register-primary-btn">Login</button>
          </form>

          <p className="register-switch-text">
            Don't have an account? <Link to={"/login"}>Login</Link></p>
        </div>
      </div>
    </div>
  );
}