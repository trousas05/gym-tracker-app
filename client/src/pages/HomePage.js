import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="container">
        <h1>Welcome to Gym Tracker</h1>
        <p>Your ultimate fitness companion to track workouts and progress</p>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;