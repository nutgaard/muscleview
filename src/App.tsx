import { useState } from "react";
import { type ExerciseData, type ExerciseId, exercises } from "./exercises.js";
import { ExerciseAtlas } from "./components/ExerciseAtlas.js";
import { FinderPanel } from "./components/FinderPanel.js";
import styles from "./App.module.css";

function App() {
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>(exercises);
  const [currentExerciseId, setCurrentExerciseId] = useState<ExerciseId>(exercises[0]!.id);
  const currentExercise =
    filteredExercises.find(({ id }) => id === currentExerciseId) ?? filteredExercises[0] ?? null;

  return (
    <main className={styles.shell}>
      <section className={styles.workspace}>
        <ExerciseAtlas exercise={currentExercise} />

        <FinderPanel
          setFilteredExercises={setFilteredExercises}
          currentExerciseId={currentExercise?.id ?? currentExerciseId}
          setCurrentExerciseId={setCurrentExerciseId}
        />
      </section>
    </main>
  );
}

export default App;
