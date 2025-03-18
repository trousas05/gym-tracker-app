const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Exercise = require("../models/Exercise");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedExercises();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Seed exercises
const seedExercises = async () => {
  try {
    // Clear existing exercises
    await Exercise.deleteMany({ isCustom: false });
    
    // Standard exercises
    const exercises = [
      {
        name: "Bench Press",
        category: "chest",
        instructions:
          "Lie on a flat bench with your feet on the ground. Grip the barbell with hands slightly wider than shoulder-width apart. Lower the bar to your chest, then press it back up to starting position.",
        mainMuscles: ["chest", "shoulders", "triceps"],
        equipment: "barbell",
        difficulty: "intermediate",
        isCustom: false,
      },
      {
        name: "Squat",
        category: "legs",
        instructions:
          "Stand with feet shoulder-width apart, holding a barbell across your upper back. Bend your knees and hips to lower your body, keeping your chest up. Push through your heels to return to starting position.",
        mainMuscles: ["quadriceps", "hamstrings", "glutes"],
        equipment: "barbell",
        difficulty: "intermediate",
        isCustom: false,
      },
      {
        name: "Deadlift",
        category: "back",
        instructions:
          "Stand with feet hip-width apart, barbell over your feet. Bend at the hips and knees to grip the bar. Keeping your back straight, stand up tall, lifting the bar to hip level. Lower the bar by hinging at the hips and bending the knees.",
        mainMuscles: ["back", "hamstrings", "glutes"],
        equipment: "barbell",
        difficulty: "intermediate",
        isCustom: false,
      },
      {
        name: "Pull-up",
        category: "back",
        instructions:
          "Hang from a pull-up bar with palms facing away from you and hands shoulder-width apart. Pull your body up until your chin clears the bar, then lower back to hanging position.",
        mainMuscles: ["back", "biceps", "shoulders"],
        equipment: "pull-up bar",
        difficulty: "intermediate",
        isCustom: false,
      },
      {
        name: "Push-up",
        category: "chest",
        instructions:
          "Start in a high plank position with hands slightly wider than shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up to starting position.",
        mainMuscles: ["chest", "shoulders", "triceps"],
        equipment: "bodyweight",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Shoulder Press",
        category: "shoulders",
        instructions:
          "Sit on a bench with back support. Hold dumbbells at shoulder height with palms facing forward. Press weights upward until arms are extended, then lower to starting position.",
        mainMuscles: ["shoulders", "triceps"],
        equipment: "dumbbells",
        difficulty: "intermediate",
        isCustom: false,
      },
      {
        name: "Bicep Curl",
        category: "arms",
        instructions:
          "Stand holding dumbbells at your sides with palms facing forward. Keeping upper arms stationary, curl weights up to shoulder level, then lower to starting position.",
        mainMuscles: ["biceps"],
        equipment: "dumbbells",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Tricep Extension",
        category: "arms",
        instructions:
          "Hold a dumbbell with both hands above your head, arms extended. Lower the weight behind your head by bending your elbows, then extend your arms back to starting position.",
        mainMuscles: ["triceps"],
        equipment: "dumbbell",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Plank",
        category: "core",
        instructions:
          "Start in a forearm plank position with elbows directly beneath your shoulders and forearms on the ground. Keep your body in a straight line from head to heels, engaging your core.",
        mainMuscles: ["core", "shoulders"],
        equipment: "bodyweight",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Leg Press",
        category: "legs",
        instructions:
          "Sit in the leg press machine with your back against the padded support. Place your feet on the platform, shoulder-width apart. Push the platform away by extending your knees, then slowly return to starting position.",
        mainMuscles: ["quadriceps", "hamstrings", "glutes"],
        equipment: "machine",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Lat Pulldown",
        category: "back",
        instructions:
          "Sit at a lat pulldown machine with a wide grip on the bar. Pull the bar down to your upper chest, then slowly return to starting position with arms fully extended.",
        mainMuscles: ["back", "biceps"],
        equipment: "cable",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Dumbbell Row",
        category: "back",
        instructions:
          "Place your right knee and hand on a bench, left foot on the floor. Hold a dumbbell in your left hand, arm extended. Pull the weight up to your side, then lower to starting position.",
        mainMuscles: ["back", "biceps"],
        equipment: "dumbbell",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Lunges",
        category: "legs",
        instructions:
          "Stand with feet hip-width apart. Step forward with one leg and lower your body until both knees are bent at 90-degree angles. Push off the front foot to return to starting position.",
        mainMuscles: ["quadriceps", "hamstrings", "glutes"],
        equipment: "bodyweight",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Crunches",
        category: "core",
        instructions:
          "Lie on your back with knees bent and feet flat on the floor. Place hands behind your head. Lift your shoulders off the ground, then lower back down with control.",
        mainMuscles: ["core"],
        equipment: "bodyweight",
        difficulty: "beginner",
        isCustom: false,
      },
      {
        name: "Russian Twist",
        category: "core",
        instructions:
          "Sit on the floor with knees bent and feet lifted slightly. Lean back slightly, keeping your back straight. Twist your torso to the right, then to the left, moving your hands across your body.",
        mainMuscles: ["core", "obliques"],
        equipment: "bodyweight",
        difficulty: "beginner",
        isCustom: false,
      },
    ];
    
    // Insert exercises
    await Exercise.insertMany(exercises);
    
    console.log(`${exercises.length} exercises seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding exercises:", error);
    process.exit(1);
  }
};