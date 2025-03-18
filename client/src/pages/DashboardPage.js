import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DashboardPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    workoutsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's recent workouts and stats
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would get the token from localStorage
        const token = localStorage.getItem("token");
        
        // Example API calls
        const workoutsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/workouts/recent`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const statsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setWorkouts(workoutsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // For demo purposes, set some mock data
        setWorkouts([
          { _id: '1', name: 'Upper Body Workout', date: '2025-03-10', duration: 45 },
          { _id: '2', name: 'Leg Day', date: '2025-03-12', duration: 60 },
          { _id: '3', name: 'Full Body Workout', date: '2025-03-14', duration: 75 }
        ]);
        
        setStats({
          totalWorkouts: 23,
          totalExercises: 156,
          workoutsThisWeek: 3
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Workouts</h3>
            <p className="stat-value">{stats.totalWorkouts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Exercises</h3>
            <p className="stat-value">{stats.totalExercises}</p>
          </div>
          <div className="stat-card">
            <h3>Workouts This Week</h3>
            <p className="stat-value">{stats.workoutsThisWeek}</p>
          </div>
        </div>
        
        <div className="recent-workouts">
          <div className="section-header">
            <h2>Recent Workouts</h2>
            <Link to="/workout/log" className="btn btn-primary">Log Workout</Link>
          </div>
          
          {workouts.length > 0 ? (
            <ul className="workout-list">
              {workouts.map(workout => (
                <li key={workout._id} className="workout-item">
                  <div className="workout-info">
                    <h3>{workout.name}</h3>
                    <p>Date: {new Date(workout.date).toLocaleDateString()}</p>
                    <p>Duration: {workout.duration} minutes</p>
                  </div>
                  <Link to={`/workout/${workout._id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No recent workouts found. Start logging your first workout!</p>
          )}
        </div>
        
        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="links-container">
            <Link to="/exercises" className="quick-link">
              <span className="icon">📚</span>
              <span>Exercise Library</span>
            </Link>
            <Link to="/workout/plan" className="quick-link">
              <span className="icon">📝</span>
              <span>Create Workout Plan</span>
            </Link>
            <Link to="/profile" className="quick-link">
              <span className="icon">👤</span>
              <span>Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;