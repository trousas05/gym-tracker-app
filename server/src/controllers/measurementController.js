const Measurement = require("../models/Measurement");

// @desc    Get all measurements for the current user
// @route   GET /api/measurements
// @access  Private
exports.getMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.find({ user: req.user._id }).sort({
      date: -1,
    });
    
    res.status(200).json(measurements);
  } catch (error) {
    console.error("Get measurements error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get measurement by ID
// @route   GET /api/measurements/:id
// @access  Private
exports.getMeasurementById = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    
    // Check if measurement exists
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    
    // Check if user owns the measurement
    if (measurement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to access this measurement",
      });
    }
    
    res.status(200).json(measurement);
  } catch (error) {
    console.error("Get measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new measurement
// @route   POST /api/measurements
// @access  Private
exports.createMeasurement = async (req, res) => {
  try {
    const {
      date,
      weight,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      calves,
      shoulders,
      notes,
    } = req.body;
    
    // Create measurement
    const measurement = await Measurement.create({
      user: req.user._id,
      date,
      weight,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      calves,
      shoulders,
      notes,
    });
    
    res.status(201).json(measurement);
  } catch (error) {
    console.error("Create measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update measurement
// @route   PUT /api/measurements/:id
// @access  Private
exports.updateMeasurement = async (req, res) => {
  try {
    const {
      date,
      weight,
      bodyFat,
      chest,
      waist,
      hips,
      arms,
      thighs,
      calves,
      shoulders,
      notes,
    } = req.body;
    
    // Find measurement
    let measurement = await Measurement.findById(req.params.id);
    
    // Check if measurement exists
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    
    // Check if user owns the measurement
    if (measurement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this measurement",
      });
    }
    
    // Update fields
    if (date) measurement.date = date;
    if (weight !== undefined) measurement.weight = weight;
    if (bodyFat !== undefined) measurement.bodyFat = bodyFat;
    if (chest !== undefined) measurement.chest = chest;
    if (waist !== undefined) measurement.waist = waist;
    if (hips !== undefined) measurement.hips = hips;
    if (arms !== undefined) measurement.arms = arms;
    if (thighs !== undefined) measurement.thighs = thighs;
    if (calves !== undefined) measurement.calves = calves;
    if (shoulders !== undefined) measurement.shoulders = shoulders;
    if (notes !== undefined) measurement.notes = notes;
    
    // Save measurement
    await measurement.save();
    
    res.status(200).json(measurement);
  } catch (error) {
    console.error("Update measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete measurement
// @route   DELETE /api/measurements/:id
// @access  Private
exports.deleteMeasurement = async (req, res) => {
  try {
    // Find measurement
    const measurement = await Measurement.findById(req.params.id);
    
    // Check if measurement exists
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }
    
    // Check if user owns the measurement
    if (measurement.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this measurement",
      });
    }
    
    // Delete measurement
    await measurement.remove();
    
    res.status(200).json({ message: "Measurement removed" });
  } catch (error) {
    console.error("Delete measurement error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get measurement stats
// @route   GET /api/measurements/stats
// @access  Private
exports.getMeasurementStats = async (req, res) => {
  try {
    // Get latest measurement
    const latestMeasurement = await Measurement.findOne({
      user: req.user._id,
    }).sort({ date: -1 });
    
    // Get first measurement
    const firstMeasurement = await Measurement.findOne({
      user: req.user._id,
    }).sort({ date: 1 });
    
    // Calculate changes
    let stats = {
      latest: latestMeasurement || null,
      changes: null,
    };
    
    if (latestMeasurement && firstMeasurement) {
      stats.changes = {
        weight:
          latestMeasurement.weight !== null && firstMeasurement.weight !== null
            ? latestMeasurement.weight - firstMeasurement.weight
            : null,
        bodyFat:
          latestMeasurement.bodyFat !== null &&
          firstMeasurement.bodyFat !== null
            ? latestMeasurement.bodyFat - firstMeasurement.bodyFat
            : null,
        chest:
          latestMeasurement.chest !== null && firstMeasurement.chest !== null
            ? latestMeasurement.chest - firstMeasurement.chest
            : null,
        waist:
          latestMeasurement.waist !== null && firstMeasurement.waist !== null
            ? latestMeasurement.waist - firstMeasurement.waist
            : null,
        arms:
          latestMeasurement.arms !== null && firstMeasurement.arms !== null
            ? latestMeasurement.arms - firstMeasurement.arms
            : null,
        thighs:
          latestMeasurement.thighs !== null && firstMeasurement.thighs !== null
            ? latestMeasurement.thighs - firstMeasurement.thighs
            : null,
      };
    }
    
    res.status(200).json(stats);
  } catch (error) {
    console.error("Get measurement stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};