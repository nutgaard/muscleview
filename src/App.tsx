import { useEffect, useState } from "react";
import { type ExerciseData, type ExerciseId, exercises } from "./exercises.js";
import { ExerciseAtlas } from "./components/ExerciseAtlas.js";
import { FinderPanelUnified } from "./components/FinderPanelUnified.js";
import { HeroPanel } from "./components/HeroPanel.js";
import "./design-system.css";
import "./App.css";

function App() {
  const [filteredExercises, setFilteredExercises] = useState<ExerciseData[]>(exercises);
  const [currentExerciseId, setcurrentExerciseId] = useState<ExerciseId>(exercises[0]!.id);
  const currentExercise =
    filteredExercises.find((it) => it.id === currentExerciseId) ?? filteredExercises[0] ?? null;

  useEffect(() => {
    if (filteredExercises.length === 0) return;
    else {
      const isIncluded = filteredExercises.find((it) => it.id === currentExerciseId);
      if (isIncluded) return;
      else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setcurrentExerciseId(filteredExercises.at(0)!.id);
      }
    }
  }, [currentExerciseId, filteredExercises]);

  return (
    <main className="app-shell">
      <HeroPanel />
      <section className="workspace">
        <ExerciseAtlas exercise={currentExercise} />

        <FinderPanelUnified
          filteredExercises={filteredExercises}
          setFilteredExercises={setFilteredExercises}
          currentExerciseId={currentExerciseId}
          setCurrentExerciseId={setcurrentExerciseId}
        />
      </section>
    </main>
  );
}

export default App;
