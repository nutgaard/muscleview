import { useEffect, useRef } from "react";
import BackMuscleView from "../assets/BackMuscleView.svg?react";
import FrontMuscleView from "../assets/FrontMuscleView.svg?react";
import type { ExerciseData } from "../exercises.js";
import { ActionLink, InfoPill, SurfacePanel } from "../design-system.js";
import { formatLabel } from "../muscle-view.js";

interface ExerciseAtlasProps {
  exercise: ExerciseData | null;
}

interface AnatomyPanelProps {
  label: string;
  SvgComponent: typeof FrontMuscleView;
  currentExercise?: ExerciseData;
}

function AnatomyPanel({ label, SvgComponent, currentExercise }: AnatomyPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    panel.querySelectorAll<SVGGElement>("svg g[class]").forEach((group) => {
      group.classList.remove("is-high", "is-low");
    });

    if (!currentExercise) {
      return;
    }

    currentExercise.muscleGroups.forEach(({ muscle, stress }) => {
      panel.querySelectorAll<SVGGElement>(`svg g.${muscle}`).forEach((group) => {
        group.classList.add(stress === "HIGH" ? "is-high" : "is-low");
      });
    });
  }, [currentExercise]);

  return (
    <figure ref={panelRef} className="anatomy-panel">
      <figcaption>{label}</figcaption>
      <div className="anatomy-map" aria-hidden="true">
        <SvgComponent className="anatomy-svg" focusable="false" />
      </div>
    </figure>
  );
}

export function ExerciseAtlas({ exercise }: ExerciseAtlasProps) {
  const primaryMuscles = exercise?.muscleGroups.filter(({ stress }) => stress === "HIGH") ?? [];
  const secondaryMuscles = exercise?.muscleGroups.filter(({ stress }) => stress === "LOW") ?? [];

  if (exercise == null) {
    return (
      <SurfacePanel className="atlas-panel">
        <div className="empty-state">
          <div className="panel-heading empty-heading">
            <p className="panel-kicker">No match</p>
            <h2 className="panel-title">Nothing fits the current filters.</h2>
            <p className="muted-copy">Try a broader search or clear one of the active filters.</p>
          </div>
        </div>
      </SurfacePanel>
    );
  }

  return (
    <SurfacePanel className="atlas-panel">
      <header className="atlas-header">
        <div className="panel-heading">
          <p className="panel-kicker">Current exercise</p>
          <h2 className="panel-title">{exercise.name}</h2>
        </div>
      </header>

      <section className="anatomy-stage" aria-label="Body map">
        <div className="legend-row anatomy-legend" aria-label="Stress legend">
          <span>
            <i className="legend-swatch is-primary" />
            primary stress
          </span>
          <span>
            <i className="legend-swatch is-secondary" />
            secondary stress
          </span>
        </div>

        <AnatomyPanel label="Front" SvgComponent={FrontMuscleView} currentExercise={exercise} />
        <AnatomyPanel label="Back" SvgComponent={BackMuscleView} currentExercise={exercise} />
      </section>

      <section className="atlas-notes">
        <article className="atlas-section">
          <h3 className="atlas-section-title">Stress</h3>
          <div className="stress-columns">
            <div className="stress-column">
              <p className="stress-group-label">Primary</p>
              <div className="pill-row">
                {primaryMuscles.map(({ muscle }) => (
                  <InfoPill key={muscle}>{formatLabel(muscle)}</InfoPill>
                ))}
              </div>
            </div>

            <div className="stress-column">
              <p className="stress-group-label">Secondary</p>
              <div className="pill-row">
                {secondaryMuscles.length ? (
                  secondaryMuscles.map(({ muscle }) => (
                    <InfoPill key={muscle}>{formatLabel(muscle)}</InfoPill>
                  ))
                ) : (
                  <p className="muted-copy">No secondary stress is marked for this lift.</p>
                )}
              </div>
            </div>
          </div>
        </article>

        <article className="atlas-section">
          <h3 className="atlas-section-title">Lift notes</h3>
          <dl className="profile-list">
            <div>
              <dt>Movement</dt>
              <dd>{formatLabel(exercise.movementType.toLowerCase())}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatLabel(exercise.weightType.toLowerCase())}</dd>
            </div>
            <div>
              <dt>Warmup type</dt>
              <dd>{formatLabel(exercise.warmupType.toLowerCase())}</dd>
            </div>
            <div>
              <dt>Warmup on by default</dt>
              <dd>{exercise.warmupEnabledByDefault ? "Yes" : "No"}</dd>
            </div>
          </dl>

          <div className="detail-actions">
            <ActionLink href={exercise.shortVideoUrl}>Short demo</ActionLink>
            <ActionLink href={exercise.fullVideoUrl}>Full walkthrough</ActionLink>
          </div>
        </article>
      </section>
    </SurfacePanel>
  );
}
