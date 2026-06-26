import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CodingPracticePage from '../pages/CodingPracticePage.jsx'
import ResumAnalyzerPage from "../pages/ResumAnalyzerPage.jsx"
import DashboardPage from '../pages/DashboardPage.jsx'
import MCQsPage from '../pages/MCQsPage.jsx'
import McqTest from '../components/MCQ Test/McqTest.jsx'
import McqResult from '../components/MCQ Test/McqResult.jsx'
import ResumeAnalysePage from '../components/ResumeAnalyzer/ResumeAnalysePage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import RegisterPage from '../pages/RegisterPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import AdminRoute from './AdminRoute.jsx'
import Panel from '../Admin/Panel.jsx'

const AppRoutes = () => {
  return (
    <>
    <Routes>

       <Route
          path="/"
          element={<RegisterPage />}
        />

      <Route
          path="/register"
          element={<RegisterPage />}
        />

      <Route
          path="/login"
          element={<LoginPage/>}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

      <Route
          path="/coding"
          element={<CodingPracticePage />}
        />

      <Route
          path="/mcq"
          element={<MCQsPage />}
        />
      
      
         <Route
          path="/mcq/test"
          element={<McqTest />}
        />

        <Route
          path="/mcq/test/result"
          element={<McqResult />}
        />


      <Route
          path="/resume"
          element={<ResumAnalyzerPage />}
        />
        <Route
          path="/resume/analyse"
          element={<ResumeAnalysePage />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        
        <Route
    path="/admin/*"
    element={
        <AdminRoute>
            <Panel />
        </AdminRoute>
    }
/>





      </Routes>
    </>
  )
}

export default AppRoutes