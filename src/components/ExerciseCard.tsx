import type { ExerciseData } from "../exercises.js";
import { formatLabel } from "../muscle-view.js";
import { InfoPill } from "./ui/InfoPill.js";
import styles from "./ExerciseCard.module.css";

type ExerciseCardProps = {
  exercise: ExerciseData;
  active: boolean;
  onSelect: () => void;
};

export function ExerciseCard({ exercise, active, onSelect }: ExerciseCardProps) {
  const cardClassName = active ? `${styles.card} ${styles.active}` : styles.card;

  return (
    <button type="button" className={cardClassName} onClick={onSelect}>
      <strong className={styles.title}>{exercise.name}</strong>
      <div className={styles.muscles}>
        {exercise.muscleGroups
          .filter(({ stress }) => stress === "HIGH")
          .map(({ muscle }) => (
            <InfoPill key={`${exercise.id}-${muscle}`} tone="muscle">
              {formatLabel(muscle)}
            </InfoPill>
          ))}
      </div>
    </button>
  );
}
