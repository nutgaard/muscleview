import BackMuscleView from "../assets/BackMuscleView.svg?react";
import FrontMuscleView from "../assets/FrontMuscleView.svg?react";
import type { ExerciseData } from "../exercises.js";
import { formatLabel } from "../muscle-view.js";
import { AnatomyMapPanel } from "./AnatomyMapPanel.js";
import { ActionLink } from "./ui/ActionLink.js";
import { InfoPill } from "./ui/InfoPill.js";
import { PanelCard } from "./ui/PanelCard.js";
import styles from "./ExerciseAtlas.module.css";

interface ExerciseAtlasProps {
  exercise: ExerciseData | null;
}

export function ExerciseAtlas({ exercise }: ExerciseAtlasProps) {
  if (exercise == null) {
    return (
      <PanelCard className={styles.panel}>
        <div className={styles.emptyState}>
          <div className={`${styles.header} ${styles.emptyHeading}`}>
            <h2 className={styles.title}>Nothing fits the current filters.</h2>
            <p className={styles.mutedCopy}>
              Try a broader search or clear one of the active filters.
            </p>
          </div>
        </div>
      </PanelCard>
    );
  }
  const muscleGroups = Object.groupBy(exercise.muscleGroups, (it) => it.stress);
  const primaryMuscles = muscleGroups.HIGH ?? [];
  const secondaryMuscles = muscleGroups.LOW ?? [];

  return (
    <PanelCard className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>{exercise.name}</h2>
      </header>

      <section className={styles.stage} aria-label="Body map">
        <div className={styles.legend} aria-label="Stress legend">
          <span className={styles.legendItem}>
            <i className={`${styles.legendSwatch} ${styles.primarySwatch}`} />
            primary stress
          </span>
          <span className={styles.legendItem}>
            <i className={`${styles.legendSwatch} ${styles.secondarySwatch}`} />
            secondary stress
          </span>
        </div>

        <AnatomyMapPanel label="Front" SvgComponent={FrontMuscleView} exercise={exercise} />
        <AnatomyMapPanel label="Back" SvgComponent={BackMuscleView} exercise={exercise} />
      </section>

      <section className={styles.notes}>
        <article className={styles.section}>
          <h3 className={styles.sectionTitle}>Stress</h3>
          <div className={styles.stressColumns}>
            <div className={styles.stressColumn}>
              <p className={styles.stressLabel}>Primary</p>
              <div className={styles.pillRow}>
                {primaryMuscles.map(({ muscle }) => (
                  <InfoPill key={muscle}>{formatLabel(muscle)}</InfoPill>
                ))}
              </div>
            </div>

            <div className={styles.stressColumn}>
              <p className={styles.stressLabel}>Secondary</p>
              <div className={styles.pillRow}>
                {secondaryMuscles.length ? (
                  secondaryMuscles.map(({ muscle }) => (
                    <InfoPill key={muscle}>{formatLabel(muscle)}</InfoPill>
                  ))
                ) : (
                  <p className={styles.mutedCopy}>No secondary stress is marked for this lift.</p>
                )}
              </div>
            </div>
          </div>
        </article>

        <article className={styles.section}>
          <h3 className={styles.sectionTitle}>Overview</h3>
          <dl className={styles.profileList}>
            <div className={styles.profileRow}>
              <dt className={styles.term}>Movement</dt>
              <dd className={styles.description}>
                {formatLabel(exercise.movementType.toLowerCase())}
              </dd>
            </div>
            <div className={styles.profileRow}>
              <dt className={styles.term}>Weight</dt>
              <dd className={styles.description}>
                {formatLabel(exercise.weightType.toLowerCase())}
              </dd>
            </div>
          </dl>

          <div className={styles.detailActions}>
            <ActionLink href={exercise.shortVideoUrl}>Short demo</ActionLink>
            <ActionLink href={exercise.fullVideoUrl}>Full walkthrough</ActionLink>
          </div>
        </article>
      </section>
    </PanelCard>
  );
}
