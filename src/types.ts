import type { ExerciseId } from "./exercises.js";

export type WeightUnit = "kg" | "lb";

export type WeightType = "BODYWEIGHT" | "BARBELL" | "DUMBBELL" | "MACHINE" | "OTHER";

export type WarmupType =
  | "BODYWEIGHT"
  | "BAR_MAIN"
  | "BAR_PULL"
  | "DUMBBELL"
  | "MACHINE"
  | "BAR_ISO"
  | "NONE";

export type GoalType = "TIME" | "WEIGHT";

export type MovementType =
  | "MISC"
  | "HORIZONTAL_PULL"
  | "HORIZONTAL_PUSH"
  | "VERTICAL_PULL"
  | "VERTICAL_PUSH"
  | "HIP_HINGE"
  | "SQUAT";

export type MuscleType = "ARMS" | "BACK" | "CHEST" | "LEGS" | "SHOULDERS" | "ABS" | "OTHER";

export type Muscle =
  | "abductors"
  | "abs"
  | "biceps"
  | "calfs"
  | "forearms"
  | "glutes"
  | "hamstrings"
  | "hip_abductors"
  | "hip_flexors"
  | "lats"
  | "lower_back"
  | "obliques"
  | "pects"
  | "quads"
  | "rear_delts"
  | "shoulders"
  | "traps"
  | "triceps"
  | "upper_traps";

export type MuscleStress = "HIGH" | "LOW";

export interface ExerciseMuscleGroup {
  muscle: Muscle;
  stress: MuscleStress;
}

export interface Weight {
  unit: WeightUnit;
  value: number;
}

export interface WorkingSetInput {
  weight: Weight;
  target: number;
}

export interface WarmupSet extends WorkingSetInput {
  result?: unknown;
}

export interface GenerateWarmupSetsInput {
  exerciseId: ExerciseId;
  goalType: GoalType;
  workingSets: readonly WorkingSetInput[];
  warmupSets?: readonly WarmupSet[];
  barbellWeight?: Weight;
}
