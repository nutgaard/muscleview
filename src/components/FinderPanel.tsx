import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from "react";
import type { ExerciseData, ExerciseId } from "../exercises.js";
import { exercises } from "../exercises.js";
import {
  buildMuscleOptions,
  buildWeightTypeOptions,
  matchesAnySelection,
  matchesExerciseQuery,
} from "../muscle-view.js";
import type { Muscle, WeightType } from "../types.js";
import { ExerciseCard } from "./ExerciseCard.js";
import { MultiSelectField } from "./MultiSelectField.js";
import { PanelCard } from "./ui/PanelCard.js";
import { SearchInput } from "./ui/SearchInput.js";
import styles from "./FinderPanel.module.css";

type FinderPanelProps = {
  currentExerciseId: ExerciseId;
  setCurrentExerciseId: Dispatch<SetStateAction<ExerciseId>>;
  setFilteredExercises: Dispatch<SetStateAction<ExerciseData[]>>;
};

function toggleSelection<T extends string>(currentValues: readonly T[], value: T): T[] {
  return currentValues.includes(value)
    ? currentValues.filter((currentValue) => currentValue !== value)
    : [...currentValues, value];
}

export function FinderPanel({
  currentExerciseId,
  setCurrentExerciseId,
  setFilteredExercises,
}: FinderPanelProps) {
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState<Muscle[]>([]);
  const [selectedWeightTypes, setSelectedWeightTypes] = useState<WeightType[]>([]);
  const muscleOptions = useMemo(() => buildMuscleOptions(exercises), []);
  const weightTypeOptions = useMemo(() => buildWeightTypeOptions(exercises), []);
  const visibleExercises = useMemo(() => {
    const normalizedQuery = exerciseQuery.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesQuery = matchesExerciseQuery(exercise, normalizedQuery);
      const matchesMuscles = matchesAnySelection(
        selectedMuscles,
        exercise.muscleGroups.map(({ muscle }) => muscle),
      );
      const matchesWeightTypes = matchesAnySelection(selectedWeightTypes, [exercise.weightType]);

      return matchesQuery && matchesMuscles && matchesWeightTypes;
    });
  }, [exerciseQuery, selectedMuscles, selectedWeightTypes]);
  const resultSummary = `${visibleExercises.length} exercises`;

  useEffect(() => {
    setFilteredExercises(visibleExercises);
  }, [setFilteredExercises, visibleExercises]);

  return (
    <div className={styles.mount}>
      <PanelCard className={styles.panel} allowOverflow aria-label="Exercise filters and results">
        <SearchInput
          label="Search"
          value={exerciseQuery}
          onChange={(event) => {
            setExerciseQuery(event.target.value);
          }}
          placeholder="Bench press, row, squat..."
        />

        <div className={styles.filters} aria-label="Exercise filters">
          <MultiSelectField
            label="Muscles"
            accent="muscle"
            options={muscleOptions}
            selectedValues={selectedMuscles}
            onToggleValue={(value) => {
              setSelectedMuscles((currentValues) => toggleSelection(currentValues, value));
            }}
            onClear={() => {
              setSelectedMuscles([]);
            }}
          />

          <MultiSelectField
            label="Equipment"
            accent="equipment"
            options={weightTypeOptions}
            selectedValues={selectedWeightTypes}
            onToggleValue={(value) => {
              setSelectedWeightTypes((currentValues) => toggleSelection(currentValues, value));
            }}
            onClear={() => {
              setSelectedWeightTypes([]);
            }}
          />
        </div>

        <div className={styles.resultsHeader}>
          <p className={styles.status}>{resultSummary}</p>
        </div>

        <div className={styles.list}>
          {visibleExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              active={exercise.id === currentExerciseId}
              onSelect={() => {
                setCurrentExerciseId(exercise.id);
              }}
            />
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
