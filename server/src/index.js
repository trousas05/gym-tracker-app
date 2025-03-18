const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require("./routes/users");
const exerciseRoutes = require("./routes/exercises");
const workoutRoutes = require("./routes/workouts");
const measurementRoutes = require("./routes/measurements");

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route middleware
app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/measurements", measurementRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Gym Tracker API is running");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    
    // Start server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  process.exit(1);
});