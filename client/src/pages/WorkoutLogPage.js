import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkoutLogPage = () => {
  const [workout, setWorkout] = useState({
    name: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    exercises: []
  });
  
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerTime, setTimerTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

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
          { _id: "1", name: "Bench Press", category: "chest", equipment: "barbell" },
          { _id: "2", name: "Squat", category: "legs", equipment: "barbell" },
          { _id: "3", name: "Pull-up", category: "back", equipment: "pull-up bar" },
          { _id: "4", name: "Shoulder Press", category: "shoulders", equipment: "dumbbells" },
          { _id: "5", name: "Bicep Curl", category: "arms", equipment: "dumbbells" },
          { _id: "6", name: "Deadlift", category: "back", equipment: "barbell" },
          { _id: "7", name: "Tricep Extension", category: "arms", equipment: "cable" },
          { _id: "8", name: "Leg Press", category: "legs", equipment: "machine" },
          { _id: "9", name: "Lat Pulldown", category: "back", equipment: "cable" },
          { _id: "10", name: "Push-up", category: "chest", equipment: "bodyweight" }
        ];
        setExercises(mockExercises);
        setFilteredExercises(mockExercises);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();

    // Timer cleanup
    return () => {
      if (activeTimer) {
        clearInterval(activeTimer);
      }
    };
  }, [activeTimer]);

  useEffect(() => {
    // Filter exercises based on search term
    if (searchTerm) {
      const filtered = exercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchTerm, exercises]);

  const addExerciseToWorkout = (exercise) => {
    const newExercise = {
      exerciseId: exercise._id,
      name: exercise.name,
      sets: [{ setNumber: 1, reps: "", weight: "", completed: false }]
    };
    
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, newExercise]
    });
  };

  const removeExerciseFromWorkout = (index) => {
    const updatedExercises = [...workout.exercises];
    updatedExercises.splice(index, 1);
    
    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const addSetToExercise = (exerciseIndex) => {
    const updatedExercises = [...workout.exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    
    updatedExercises[exerciseIndex].sets = [
      ...currentSets,
      {
        setNumber: currentSets.length + 1,
        reps: "",
        weight: "",
        completed: false
      }
    ];
    
    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const removeSetFromExercise = (exerciseIndex, setIndex) => {
    const updatedExercises = [...workout.exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    
    // Update set numbers
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.map((set, idx) => ({
      ...set,
      setNumber: idx + 1
    }));
    
    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...workout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    
    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const toggleSetCompletion = (exerciseIndex, setIndex) => {
    const updatedExercises = [...workout.exercises];
    updatedExercises[exerciseIndex].sets[setIndex].completed = 
      !updatedExercises[exerciseIndex].sets[setIndex].completed;
    
    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
  };

  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkout({ ...workout, [name]: value });
  };

  const startTimer = () => {
    setTimerRunning(true);
    const timer = setInterval(() => {
      setTimerTime(prevTime => prevTime + 1);
    }, 1000);
    setActiveTimer(timer);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
    if (activeTimer) {
      clearInterval(activeTimer);
      setActiveTimer(null);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimerTime(0);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const saveWorkout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/workouts`,
        workout,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Workout saved successfully!");
      
      // Reset form
      setWorkout({
        name: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
        exercises: []
      });
      
      resetTimer();
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading">Loading exercise data...</div>;
  }

  return (
    <div className="workout-log-page">
      <div className="container">
        <h1>Log Workout</h1>
        
        <div className="workout-form">
          <div className="workout-header">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Workout Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="E.g., Upper Body, Leg Day, etc."
                  value={workout.name}
                  onChange={handleWorkoutChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={workout.date}
                  onChange={handleWorkoutChange}
                  required
                />
              </div>
            </div>
            
            <div className="workout-timer">
              <div className="timer-display">{formatTime(timerTime)}</div>
              <div className="timer-controls">
                {!timerRunning ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={startTimer}
                  >
                    Start
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={pauseTimer}
                  >
                    Pause
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetTimer}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          
          <div className="workout-body">
            <div className="exercise-browser">
              <h2>Add Exercises</h2>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="exercise-list">
                {filteredExercises.map(exercise => (
                  <div key={exercise._id} className="exercise-item">
                    <div className="exercise-info">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-category">{exercise.category}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => addExerciseToWorkout(exercise)}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="workout-exercises">
              <h2>Your Workout</h2>
              
              {workout.exercises.length > 0 ? (
                <div className="exercise-entries">
                  {workout.exercises.map((exercise, exerciseIndex) => (
                    <div key={`${exercise.exerciseId}-${exerciseIndex}`} className="exercise-entry">
                      <div className="exercise-header">
                        <h3>{exercise.name}</h3>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeExerciseFromWorkout(exerciseIndex)}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <table className="sets-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Weight (kg)</th>
                            <th>Reps</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIndex) => (
                            <tr 
                              key={`set-${exerciseIndex}-${setIndex}`}
                              className={set.completed ? "completed" : ""}
                            >
                              <td>{set.setNumber}</td>
                              <td>
                                <input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => handleSetChange(
                                    exerciseIndex, 
                                    setIndex, 
                                    "weight", 
                                    e.target.value
                                  )}
                                  placeholder="0"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => handleSetChange(
                                    exerciseIndex, 
                                    setIndex, 
                                    "reps", 
                                    e.target.value
                                  )}
                                  placeholder="0"
                                />
                              </td>
                              <td className="set-actions">
                                <button
                                  type="button"
                                  className={`btn btn-sm ${set.completed ? "btn-success" : "btn-outline"}`}
                                  onClick={() => toggleSetCompletion(exerciseIndex, setIndex)}
                                >
                                  {set.completed ? "✓" : "○"}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => removeSetFromExercise(exerciseIndex, setIndex)}
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm add-set"
                        onClick={() => addSetToExercise(exerciseIndex)}
                      >
                        Add Set
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-exercises">No exercises added yet. Select exercises from the list.</p>
              )}
              
              <div className="workout-notes">
                <label htmlFor="notes">Workout Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={workout.notes}
                  onChange={handleWorkoutChange}
                  placeholder="Add notes about your workout..."
                  rows="3"
                ></textarea>
              </div>
              
              <button
                type="button"
                className="btn btn-primary save-workout"
                onClick={saveWorkout}
                disabled={workout.exercises.length === 0 || !workout.name}
              >
                Save Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogPage;