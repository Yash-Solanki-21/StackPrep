import { useLocation } from "react-router-dom";
import "./App.css"
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar/Sidebar.jsx"
import AppRoutes from "./Routes/AppRoutes";

function App() {
  const location = useLocation();
    
  const isAdminRoute = location.pathname.startsWith("/admin");

    const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/";

  return (

    <>
      <Toaster position="top-right" 
              toastOptions={{
             duration: 3000,
            style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            fontSize:15,
            padding: "15px 20px",
          },
        }} />


  {isAuthPage ? (
    <AppRoutes />
) : isAdminRoute ? (
    <AppRoutes />
) : (
    <div className="app-container">
        <Sidebar />
        <AppRoutes />
    </div>
)}
    </>
  );
}

export default App;