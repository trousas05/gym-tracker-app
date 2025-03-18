import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Apply dark mode if enabled
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
  };
  
  // Don't show navbar on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="logo">💪</span> Gym Tracker
        </Link>
        
        <div className="navbar-menu">
          {isLoggedIn ? (
            <>
              <Link 
                to="/dashboard" 
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>
              <Link 
                to="/workout/log" 
                className={location.pathname === "/workout/log" ? "active" : ""}
              >
                Log Workout
              </Link>
              <Link 
                to="/exercises" 
                className={location.pathname === "/exercises" ? "active" : ""}
              >
                Exercises
              </Link>
              <Link 
                to="/profile" 
                className={location.pathname === "/profile" ? "active" : ""}
              >
                Profile
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Login</Link>
              <Link to="/register" className="btn btn-secondary">Register</Link>
            </>
          )}
          
          <button 
            className="btn-icon theme-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;