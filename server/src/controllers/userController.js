const User = require("../models/User");
const Workout = require("../models/Workout");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        field: "email",
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide an email and password",
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    
    // Generate token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, height, weight, bodyFat, goals } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    // Update fields
    if (name) user.name = name;
    if (height) user.height = height;
    if (weight) user.weight = weight;
    if (bodyFat !== undefined) user.bodyFat = bodyFat;
    if (goals !== undefined) user.goals = goals;
    
    // Save user
    await user.save();
    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      height: user.height,
      weight: user.weight,
      bodyFat: user.bodyFat,
      goals: user.goals,
      role: user.role,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    // Get total workouts count
    const totalWorkouts = await Workout.countDocuments({ user: req.user._id });
    
    // Get workouts this week
    const now = new Date();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    
    const workoutsThisWeek = await Workout.countDocuments({
      user: req.user._id,
      date: { $gte: startOfWeek },
    });
    
    // Get total exercises logged
    const workouts = await Workout.find({ user: req.user._id });
    let totalExercises = 0;
    
    workouts.forEach((workout) => {
      totalExercises += workout.exercises.length;
    });
    
    res.status(200).json({
      totalWorkouts,
      workoutsThisWeek,
      totalExercises,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};