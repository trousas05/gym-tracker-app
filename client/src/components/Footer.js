import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h3>Gym Tracker</h3>
          <p>Your complete fitness tracking solution</p>
        </div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><Link to="/workout/log">Workout Logging</Link></li>
              <li><Link to="/exercises">Exercise Library</Link></li>
              <li><Link to="/profile">Progress Tracking</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Gym Tracker. All rights reserved.</p>
          <p>Created for the 5CC519 Team Project</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;