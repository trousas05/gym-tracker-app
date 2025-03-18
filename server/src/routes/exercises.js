const express = require("express");
const router = express.Router();
const {
  getExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
} = require("../controllers/exerciseController");
const { protect, restrictTo } = require("../middleware/auth");

// Public routes
router.get("/", getExercises);
router.get("/:id", getExerciseById);

// Protected routes
router.post("/", protect, createExercise);
router.put("/:id", protect, updateExercise);
router.delete("/:id", protect, deleteExercise);

module.exports = router;