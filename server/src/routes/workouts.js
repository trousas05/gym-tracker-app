const express = require("express");
const router = express.Router();
const {
  getWorkouts,
  getRecentWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutTemplates,
  createWorkoutFromTemplate,
} = require("../controllers/workoutController");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

router.get("/", getWorkouts);
router.get("/recent", getRecentWorkouts);
router.get("/templates", getWorkoutTemplates);
router.post("/from-template/:id", createWorkoutFromTemplate);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;