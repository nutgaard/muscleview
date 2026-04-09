import { useEffect, useState } from "react";
import { type ExerciseData, type ExerciseId, exercises } from "./exercises.js";
import { ExerciseAtlas } from "./components/ExerciseAtlas.js";
import { FinderPanel } from "./components/FinderPanel.js";
import styles from "./App.module.css";

function App() {
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>(exercises);
  const [currentExerciseId, setCurrentExerciseId] = useState<ExerciseId>(exercises[0]!.id);
  const currentExercise =
    filteredExercises.find((it) => it.id === currentExerciseId) ?? filteredExercises[0] ?? null;

  useEffect(() => {
    if (filteredExercises.length === 0) return;
    else {
      const isIncluded = filteredExercises.find((it) => it.id === currentExerciseId);
      if (isIncluded) return;
      else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentExerciseId(filteredExercises.at(0)!.id);
      }
    }
  }, [currentExerciseId, filteredExercises]);

  return (
    <main className={styles.shell}>
      <section className={styles.workspace}>
        <ExerciseAtlas exercise={currentExercise} />

        <FinderPanel
          setFilteredExercises={setFilteredExercises}
          currentExerciseId={currentExerciseId}
          setCurrentExerciseId={setCurrentExerciseId}
        />
      </section>
    </main>
  );
}

export default App;
