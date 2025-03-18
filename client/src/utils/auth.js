import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

// Set up axios defaults
axios.defaults.baseURL = API_URL;

// Add a request interceptor to add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const register = async (name, email, password) => {
  const response = await axios.post("/api/users/register", {
    name,
    email,
    password,
  });
  
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post("/api/users/login", {
    email,
    password,
  });
  
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};