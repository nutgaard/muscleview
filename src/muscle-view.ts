import type { ExerciseData } from "./exercises.js";
import type { Muscle } from "./types.js";

export type MuscleFilter = "ALL" | Muscle;
export type FinderMode = "exercise" | "muscle";

export interface MuscleOption {
  value: Muscle;
  label: string;
  count: number;
}

export function formatLabel(value: string): string {
  return value.replaceAll("_", " ");
}

export function matchesExerciseQuery(exercise: ExerciseData, query: string): boolean {
  if (query === "") {
    return true;
  }

  return (
    exercise.name.toLowerCase().includes(query) ||
    exercise.id.toLowerCase().includes(query.replaceAll(" ", "_"))
  );
}

export function buildMuscleOptions(sourceExercises: readonly ExerciseData[]): MuscleOption[] {
  const counts = sourceExercises.reduce<Partial<Record<Muscle, number>>>(
    (accumulator, exercise) => {
      exercise.muscleGroups.forEach(({ muscle }) => {
        accumulator[muscle] = (accumulator[muscle] ?? 0) + 1;
      });

      return accumulator;
    },
    {},
  );

  return (Object.entries(counts) as [Muscle, number][])
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([muscle, count]) => ({
      value: muscle,
      label: formatLabel(muscle),
      count,
    }));
}
