import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (token) {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/profile`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        { name, email, password }
      );
      
      localStorage.setItem("token", response.data.token);
      setCurrentUser(response.data.user);
      navigate("/dashboard");
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.message || "An error occurred during registration"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        { email, password }
      );
      
      localStorage.setItem("token", response.data.token);
      setCurrentUser(response.data.user);
      navigate("/dashboard");
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setCurrentUser(response.data);
      return true;
    } catch (error) {
      console.error("Update profile error:", error);
      setError(
        error.response?.data?.message || "An error occurred while updating profile"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};