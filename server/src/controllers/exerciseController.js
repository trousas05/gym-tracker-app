const Exercise = require("../models/Exercise");

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
exports.getExercises = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    // Filter by category if provided
    if (category && category !== "all") {
      query.category = category;
    }
    
    // Search by text if provided
    if (search) {
      query.$text = { $search: search };
    }
    
    // Find exercises
    const exercises = await Exercise.find(query).sort({ name: 1 });
    
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Get exercises error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Public
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    // Check if exercise exists
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Get exercise error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new exercise
// @route   POST /api/exercises
// @access  Private
exports.createExercise = async (req, res) => {
  try {
    const {
      name,
      category,
      instructions,
      mainMuscles,
      secondaryMuscles,
      equipment,
      difficulty,
    } = req.body;
    
    // Create exercise
    const exercise = await Exercise.create({
      name,
      category,
      instructions,
      mainMuscles,
      secondaryMuscles: secondaryMuscles || [],
      equipment,
      difficulty: difficulty || "intermediate",
      createdBy: req.user._id,
      isCustom: true,
    });
    
    res.status(201).json(exercise);
  } catch (error) {
    console.error("Create exercise error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private
exports.updateExercise = async (req, res) => {
  try {
    const {
      name,
      category,
      instructions,
      mainMuscles,
      secondaryMuscles,
      equipment,
      difficulty,
    } = req.body;
    
    // Find exercise
    let exercise = await Exercise.findById(req.params.id);
    
    // Check if exercise exists
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    
    // Check if user is the creator or admin
    if (
      exercise.createdBy &&
      exercise.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this exercise",
      });
    }
    
    // Update fields
    if (name) exercise.name = name;
    if (category) exercise.category = category;
    if (instructions) exercise.instructions = instructions;
    if (mainMuscles) exercise.mainMuscles = mainMuscles;
    if (secondaryMuscles) exercise.secondaryMuscles = secondaryMuscles;
    if (equipment) exercise.equipment = equipment;
    if (difficulty) exercise.difficulty = difficulty;
    
    // Save exercise
    await exercise.save();
    
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Update exercise error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete exercise
// @route   DELETE /api/exercises/:id
// @access  Private
exports.deleteExercise = async (req, res) => {
  try {
    // Find exercise
    const exercise = await Exercise.findById(req.params.id);
    
    // Check if exercise exists
    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }
    
    // Check if user is the creator or admin
    if (
      exercise.createdBy &&
      exercise.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this exercise",
      });
    }
    
    // Delete exercise
    await exercise.remove();
    
    res.status(200).json({ message: "Exercise removed" });
  } catch (error) {
    console.error("Delete exercise error:", error);
    res.status(500).json({ message: "Server error" });
  }
};