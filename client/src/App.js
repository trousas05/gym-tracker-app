import React from "react";
import { Routes, Route } from "react-router-dom";
import "./assets/styles/App.css";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutLogPage from "./pages/WorkoutLogPage";
import ExerciseLibraryPage from "./pages/ExerciseLibraryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout><DashboardPage /></Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/workout/log" 
        element={
          <PrivateRoute>
            <Layout><WorkoutLogPage /></Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/exercises" 
        element={
          <PrivateRoute>
            <Layout><ExerciseLibraryPage /></Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Layout><ProfilePage /></Layout>
          </PrivateRoute>
        } 
      />
      
      {/* 404 Page */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
    </Routes>
  );
}

export default App;