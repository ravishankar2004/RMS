import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './error/NotFoundPage';
// Student Pages

import StudentLogin from './pages/student/StudentLogin';
import StudentSignup from './pages/student/StudentSignup';
import StudentDash from './pages/student/StudentDashboard';
import ViewResults from './pages/student/ViewResults';
import DownloadResults from './pages/student/DownloadResults';
import ProfilePage from './pages/student/ProfilePage';

// Teacher Pages
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherSignup from './pages/teacher/TeacherSignup';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AddMarks from './pages/teacher/AddMarks';
import EditMarks from './pages/teacher/EditMarks';
import DeleteMarks from './pages/teacher/DeleteMarks';
import SearchStudent from './pages/teacher/SearchStudent';
import GenerateReports from './pages/teacher/GenerateReports';

// Homepage
import Homepage from './pages/Homepage';

import './App.css';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/student-signup" element={<StudentSignup />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/teacher-signup" element={<TeacherSignup />} />

            {/* Protected Student Routes */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute userRole="student">
                  <StudentDash />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/view-results" 
              element={
                <ProtectedRoute userRole="student">
                  <ViewResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/download-results" 
              element={
                <ProtectedRoute userRole="student">
                  <DownloadResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-profile" 
              element={
                <ProtectedRoute userRole="student">
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Teacher Routes */}
            <Route 
              path="/teacher-dashboard" 
              element={
                <ProtectedRoute userRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-marks" 
              element={
                <ProtectedRoute userRole="teacher">
                  <AddMarks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-marks" 
              element={
                <ProtectedRoute userRole="teacher">
                  <EditMarks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delete-marks" 
              element={
                <ProtectedRoute userRole="teacher">
                  <DeleteMarks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search-student" 
              element={
                <ProtectedRoute userRole="teacher">
                  <SearchStudent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate-reports" 
              element={
                <ProtectedRoute userRole="teacher">
                  <GenerateReports />
                </ProtectedRoute>
              } 
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;
