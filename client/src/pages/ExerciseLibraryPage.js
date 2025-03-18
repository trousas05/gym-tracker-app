import React, { useState, useEffect } from "react";
import axios from "axios";

const ExerciseLibraryPage = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: "all",
    search: ""
  });

  useEffect(() => {
    // Fetch exercises from API
    const fetchExercises = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/exercises`
        );
        setExercises(response.data);
        setFilteredExercises(response.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        // Mock data for demo
        const mockExercises = [
          {
            _id: "1",
            name: "Bench Press",
            category: "chest",
            instructions: "Lie on a flat bench with your feet on the ground. Grip the barbell with hands slightly wider than shoulder-width apart. Lower the bar to your chest, then press it back up to starting position.",
            mainMuscles: ["chest", "shoulders", "triceps"],
            equipment: "barbell"
          },
          {
            _id: "2",
            name: "Squat",
            category: "legs",
            instructions: "Stand with feet shoulder-width apart, holding a barbell across your upper back. Bend your knees and hips to lower your body, keeping your chest up. Push through your heels to return to starting position.",
            mainMuscles: ["quadriceps", "hamstrings", "glutes"],
            equipment: "barbell"
          },
          {
            _id: "3",
            name: "Pull-up",
            category: "back",
            instructions: "Hang from a pull-up bar with palms facing away from you and hands shoulder-width apart. Pull your body up until your chin clears the bar, then lower back to hanging position.",
            mainMuscles: ["back", "biceps", "shoulders"],
            equipment: "pull-up bar"
          },
          {
            _id: "4",
            name: "Shoulder Press",
            category: "shoulders",
            instructions: "Sit on a bench with back support. Hold dumbbells at shoulder height with palms facing forward. Press weights upward until arms are extended, then lower to starting position.",
            mainMuscles: ["shoulders", "triceps"],
            equipment: "dumbbells"
          },
          {
            _id: "5",
            name: "Bicep Curl",
            category: "arms",
            instructions: "Stand holding dumbbells at your sides with palms facing forward. Keeping upper arms stationary, curl weights up to shoulder level, then lower to starting position.",
            mainMuscles: ["biceps"],
            equipment: "dumbbells"
          }
        ];
        setExercises(mockExercises);
        setFilteredExercises(mockExercises);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    // Filter exercises based on category and search term
    const filterExercises = () => {
      let result = [...exercises];
      
      // Filter by category
      if (filter.category !== "all") {
        result = result.filter(exercise => exercise.category === filter.category);
      }
      
      // Filter by search term
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        result = result.filter(exercise => 
          exercise.name.toLowerCase().includes(searchLower) ||
          exercise.mainMuscles.some(muscle => muscle.toLowerCase().includes(searchLower))
        );
      }
      
      setFilteredExercises(result);
    };
    
    filterExercises();
  }, [filter, exercises]);

  const handleCategoryChange = (e) => {
    setFilter({ ...filter, category: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading exercises...</div>;
  }

  return (
    <div className="exercise-library-page">
      <div className="container">
        <h1>Exercise Library</h1>
        
        <div className="filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search exercises..."
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="category-filter">
            <select value={filter.category} onChange={handleCategoryChange}>
              <option value="all">All Categories</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="core">Core</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
        </div>
        
        {filteredExercises.length > 0 ? (
          <div className="exercise-grid">
            {filteredExercises.map(exercise => (
              <div key={exercise._id} className="exercise-card">
                <h3>{exercise.name}</h3>
                <div className="exercise-details">
                  <p><strong>Category:</strong> {exercise.category}</p>
                  <p><strong>Equipment:</strong> {exercise.equipment}</p>
                  <p><strong>Main Muscles:</strong> {exercise.mainMuscles.join(", ")}</p>
                </div>
                <div className="exercise-instructions">
                  <h4>Instructions:</h4>
                  <p>{exercise.instructions}</p>
                </div>
                <button className="btn btn-primary">Add to Workout</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No exercises found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibraryPage;