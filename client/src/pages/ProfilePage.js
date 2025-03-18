import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    bodyFat: "",
    goals: ""
  });
  
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    height: "",
    weight: "",
    bodyFat: "",
    goals: ""
  });
  
  const [newMeasurement, setNewMeasurement] = useState({
    date: new Date().toISOString().split("T")[0],
    weight: "",
    bodyFat: "",
    chest: "",
    arms: "",
    waist: "",
    thighs: ""
  });

  useEffect(() => {
    // Fetch user profile and measurements from API
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const measurementsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/measurements`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setUser(userResponse.data);
        setFormData(userResponse.data);
        setMeasurements(measurementsResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Mock data for demo
        const mockUser = {
          name: "John Doe",
          email: "john.doe@example.com",
          height: 180,
          weight: 75,
          bodyFat: 15,
          goals: "Build muscle and improve strength"
        };
        
        const mockMeasurements = [
          { _id: "1", date: "2024-12-01", weight: 78, bodyFat: 17, chest: 95, arms: 32, waist: 85, thighs: 55 },
          { _id: "2", date: "2025-01-01", weight: 77, bodyFat: 16.5, chest: 96, arms: 33, waist: 84, thighs: 55 },
          { _id: "3", date: "2025-02-01", weight: 76, bodyFat: 16, chest: 97, arms: 33.5, waist: 83, thighs: 56 },
          { _id: "4", date: "2025-03-01", weight: 75, bodyFat: 15, chest: 98, arms: 34, waist: 82, thighs: 57 }
        ];
        
        setUser(mockUser);
        setFormData(mockUser);
        setMeasurements(mockMeasurements);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMeasurementChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurement({ ...newMeasurement, [name]: value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setUser(formData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleMeasurementSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/measurements`,
        newMeasurement,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMeasurements([...measurements, response.data]);
      
      // Reset form
      setNewMeasurement({
        date: new Date().toISOString().split("T")[0],
        weight: "",
        bodyFat: "",
        chest: "",
        arms: "",
        waist: "",
        thighs: ""
      });
      
      alert("Measurement added successfully!");
    } catch (error) {
      console.error("Error adding measurement:", error);
      alert("Failed to add measurement. Please try again.");
    }
  };

  // Prepare chart data
  const chartData = {
    labels: measurements.map(m => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: measurements.map(m => m.weight),
        borderColor: 'rgb(74, 144, 226)',
        backgroundColor: 'rgba(74, 144, 226, 0.5)',
      },
      {
        label: 'Body Fat (%)',
        data: measurements.map(m => m.bodyFat),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  if (loading) {
    return <div className="loading">Loading profile data...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>
        
        <div className="profile-sections">
          <div className="section personal-info">
            <h2>Personal Information</h2>
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bodyFat">Body Fat %</label>
                <input
                  type="number"
                  id="bodyFat"
                  name="bodyFat"
                  value={formData.bodyFat}
                  onChange={handleProfileChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="goals">Fitness Goals</label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleProfileChange}
                  rows="3"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
          
          <div className="section measurements">
            <h2>Body Measurements</h2>
            
            <div className="measurement-chart">
              <h3>Progress Tracking</h3>
              <div className="chart-container">
                <Line data={chartData} />
              </div>
            </div>
            
            <div className="add-measurement">
              <h3>Add New Measurement</h3>
              <form onSubmit={handleMeasurementSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newMeasurement.date}
                      onChange={handleMeasurementChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="weight">Weight (kg)</label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      value={newMeasurement.weight}
                      onChange={handleMeasurementChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bodyFat">Body Fat %</label>
                    <input
                      type="number"
                      id="bodyFat"
                      name="bodyFat"
                      value={newMeasurement.bodyFat}
                      onChange={handleMeasurementChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="chest">Chest (cm)</label>
                    <input
                      type="number"
                      id="chest"
                      name="chest"
                      value={newMeasurement.chest}
                      onChange={handleMeasurementChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="arms">Arms (cm)</label>
                    <input
                      type="number"
                      id="arms"
                      name="arms"
                      value={newMeasurement.arms}
                      onChange={handleMeasurementChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="waist">Waist (cm)</label>
                    <input
                      type="number"
                      id="waist"
                      name="waist"
                      value={newMeasurement.waist}
                      onChange={handleMeasurementChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="thighs">Thighs (cm)</label>
                    <input
                      type="number"
                      id="thighs"
                      name="thighs"
                      value={newMeasurement.thighs}
                      onChange={handleMeasurementChange}
                    />
                  </div>
                </div>
                
                <button type="submit" className="btn btn-primary">Add Measurement</button>
              </form>
            </div>
            
            <div className="measurement-history">
              <h3>Measurement History</h3>
              {measurements.length > 0 ? (
                <table className="measurement-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight (kg)</th>
                      <th>Body Fat %</th>
                      <th>Chest (cm)</th>
                      <th>Arms (cm)</th>
                      <th>Waist (cm)</th>
                      <th>Thighs (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.map(measurement => (
                      <tr key={measurement._id}>
                        <td>{new Date(measurement.date).toLocaleDateString()}</td>
                        <td>{measurement.weight}</td>
                        <td>{measurement.bodyFat}</td>
                        <td>{measurement.chest}</td>
                        <td>{measurement.arms}</td>
                        <td>{measurement.waist}</td>
                        <td>{measurement.thighs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data">No measurements recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;