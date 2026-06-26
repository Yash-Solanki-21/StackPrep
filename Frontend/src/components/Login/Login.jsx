import "./Login.css";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { useState } from "react";
import loginImage from "../../../public/assets/image.jpeg"
import { useNavigate, Link } from "react-router";

export default function Login() {

  const navigate = useNavigate()
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!email.trim() || !password.trim()) {
    setError("All fields are required");
    return;
  }

  try {
 const response = await axiosInstance.post("/user/login", { email, password });
    
    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );
    
    toast.success("Login Successful");
    navigate("/dashboard");
  

  } catch (error) {
   const message = error.response?.data?.message || "Something went wrong";
      setError(message);      
      toast.error(message);   
}};
  return (
  
    <div className="login-auth-page">
      <div className="login-auth-card">
        <div className="login-auth-left">
          <h2>Welcome Back! 👋</h2>
          <p>Ace your interviews with the right preperation.</p>
          <div className="login-illustration">
            <img src={loginImage} alt="login-illustration" />
          </div>
        </div>

        <div className="login-auth-right">
          <h3>Login to your account</h3>

          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label>Email</label>
              <input 
              type="email" 
               value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" />
            </div>

            <div className="login-form-group">
              <label>Password</label>
              <div className="login-password-field">
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password" />
              </div>
            </div>

            

            {error && (
            <p className="form-error">
                  {error}
            </p>)}

            <button type="submit" className="login-primary-btn">Login</button>
          </form>

          <div className="login-divider">or</div>

          <p className="login-switch-text">
            Don't have an account? <Link to={"/register"}>Register</Link></p>
        </div>
      </div>
    </div>
   
    
  );
}