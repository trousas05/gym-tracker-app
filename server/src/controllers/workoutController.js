const Workout = require("../models/Workout");

// @desc    Get all workouts for the current user
// @route   GET /api/workouts
// @access  Private
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate({
        path: "exercises.exerciseId",
        select: "name category equipment",
      });
    
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Get workouts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get recent workouts for the current user
// @route   GET /api/workouts/recent
// @access  Private
exports.getRecentWorkouts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(limit)
      .populate({
        path: "exercises.exerciseId",
        select: "name category equipment",
      });
    
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Get recent workouts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
// @access  Private
exports.getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate({
      path: "exercises.exerciseId",
      select: "name category equipment instructions mainMuscles",
    });
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to access this workout",
      });
    }
    
    res.status(200).json(workout);
  } catch (error) {
    console.error("Get workout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
exports.createWorkout = async (req, res) => {
  try {
    const { name, date, exercises, notes, duration, isTemplate, templateName } = req.body;
    
    // Create workout
    const workout = await Workout.create({
      name,
      user: req.user._id,
      date,
      exercises,
      notes,
      duration,
      isTemplate,
      templateName,
    });
    
    res.status(201).json(workout);
  } catch (error) {
    console.error("Create workout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
exports.updateWorkout = async (req, res) => {
  try {
    const { name, date, exercises, notes, duration } = req.body;
    
    // Find workout
    let workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this workout",
      });
    }
    
    // Update fields
    if (name) workout.name = name;
    if (date) workout.date = date;
    if (exercises) workout.exercises = exercises;
    if (notes !== undefined) workout.notes = notes;
    if (duration !== undefined) workout.duration = duration;
    
    // Save workout
    await workout.save();
    
    res.status(200).json(workout);
  } catch (error) {
    console.error("Update workout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
exports.deleteWorkout = async (req, res) => {
  try {
    // Find workout
    const workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    
    // Check if user owns the workout
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this workout",
      });
    }
    
    // Delete workout
    await workout.remove();
    
    res.status(200).json({ message: "Workout removed" });
  } catch (error) {
    console.error("Delete workout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get workout templates
// @route   GET /api/workouts/templates
// @access  Private
exports.getWorkoutTemplates = async (req, res) => {
  try {
    const templates = await Workout.find({
      user: req.user._id,
      isTemplate: true,
    }).sort({ name: 1 });
    
    res.status(200).json(templates);
  } catch (error) {
    console.error("Get workout templates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create workout from template
// @route   POST /api/workouts/from-template/:id
// @access  Private
exports.createWorkoutFromTemplate = async (req, res) => {
  try {
    // Find template
    const template = await Workout.findById(req.params.id);
    
    // Check if template exists
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    
    // Check if user owns the template
    if (template.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to use this template",
      });
    }
    
    // Create new workout from template
    const workout = new Workout({
      name: template.name,
      user: req.user._id,
      date: new Date(),
      exercises: template.exercises,
      isTemplate: false,
    });
    
    // Save workout
    await workout.save();
    
    res.status(201).json(workout);
  } catch (error) {
    console.error("Create workout from template error:", error);
    res.status(500).json({ message: "Server error" });
  }
};