const express = require("express");
const router = express.Router();
const {
  getMeasurements,
  getMeasurementById,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getMeasurementStats,
} = require("../controllers/measurementController");
const { protect } = require("../middleware/auth");

// All routes are protected
router.use(protect);

router.get("/", getMeasurements);
router.get("/stats", getMeasurementStats);
router.get("/:id", getMeasurementById);
router.post("/", createMeasurement);
router.put("/:id", updateMeasurement);
router.delete("/:id", deleteMeasurement);

module.exports = router;