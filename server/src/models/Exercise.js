const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide an exercise name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: [
        "chest",
        "back",
        "legs",
        "shoulders",
        "arms",
        "core",
        "cardio",
        "full body",
        "other",
      ],
    },
    instructions: {
      type: String,
      required: [true, "Please provide exercise instructions"],
    },
    mainMuscles: {
      type: [String],
      required: [true, "Please specify main muscles worked"],
    },
    secondaryMuscles: {
      type: [String],
      default: [],
    },
    equipment: {
      type: String,
      required: [true, "Please specify equipment needed"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster searches
exerciseSchema.index({ name: "text", category: "text", mainMuscles: "text" });

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;