import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  MessageSquare,
  FileCheck,
  Code2,
  FileSearch,
  User,
  LogOut,
} from "lucide-react";

export default function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          
          <img src='https://img.icons8.com/?size=100&id=Zh3EQfzwFUbT&format=png&color=000000' alt="" />
          <h2>StackPrep</h2>
        </div>

        <nav className="sidebar-menu">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/mcq"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <FileCheck size={20} />
            <span>MCQ Tests</span>
          </NavLink>

          <NavLink
            to="/coding"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <Code2 size={20} />
            <span>Coding Practice</span>
          </NavLink>

          <NavLink
            to="/resume"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <FileSearch size={20} />
            <span>Resume Analyzer</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <User size={20}/>
            <span>Profile</span>
          </NavLink>

              {
          user?.role === "admin" && (
              <NavLink
              to="/admin/problems"
              className={({isActive}) =>
              isActive ? "menu-item active" : "menu-item"
              }
              >

              <ShieldCheck size={20}/>
              <span>Admin Panel</span>

              </NavLink>

              )
              }



        </nav>
      </div>

    </aside>
  );
}