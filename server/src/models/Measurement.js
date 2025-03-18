const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
      default: Date.now,
    },
    weight: {
      type: Number, // in kg
      default: null,
    },
    bodyFat: {
      type: Number, // percentage
      default: null,
    },
    chest: {
      type: Number, // in cm
      default: null,
    },
    waist: {
      type: Number, // in cm
      default: null,
    },
    hips: {
      type: Number, // in cm
      default: null,
    },
    arms: {
      type: Number, // in cm
      default: null,
    },
    thighs: {
      type: Number, // in cm
      default: null,
    },
    calves: {
      type: Number, // in cm
      default: null,
    },
    shoulders: {
      type: Number, // in cm
      default: null,
    },
    notes: {
      type: String,
      default: "",
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
measurementSchema.index({ user: 1, date: -1 });

const Measurement = mongoose.model("Measurement", measurementSchema);

module.exports = Measurement;