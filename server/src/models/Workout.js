const mongoose = require("mongoose");

const setSchema = new mongoose.Schema(
  {
    setNumber: {
      type: Number,
      required: true,
    },
    reps: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: null,
    },
    distance: {
      type: Number, // in meters
      default: null,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    sets: [setSchema],
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a workout name"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide a workout date"],
      default: Date.now,
    },
    duration: {
      type: Number, // in minutes
      default: null,
    },
    exercises: [exerciseSchema],
    notes: {
      type: String,
      default: "",
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateName: {
      type: String,
      default: null,
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

// Method to calculate total volume (weight * reps)
workoutSchema.methods.calculateTotalVolume = function () {
  let totalVolume = 0;
  
  this.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.weight && set.reps && set.completed) {
        totalVolume += set.weight * set.reps;
      }
    });
  });
  
  return totalVolume;
};

// Index for faster searches
workoutSchema.index({ user: 1, date: -1 });

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;