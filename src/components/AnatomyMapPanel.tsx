import { type ComponentType, type SVGProps, useEffect, useRef } from "react";
import type { ExerciseData } from "../exercises.js";
import styles from "./AnatomyMapPanel.module.css";

type AnatomyMapPanelProps = {
  label: string;
  SvgComponent: ComponentType<SVGProps<SVGSVGElement>>;
  exercise?: ExerciseData;
};

export function AnatomyMapPanel({ label, SvgComponent, exercise }: AnatomyMapPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    panel.querySelectorAll<SVGGElement>("svg g[class]").forEach((group) => {
      group.classList.remove("is-high", "is-low");
    });

    if (!exercise) {
      return;
    }

    exercise.muscleGroups.forEach(({ muscle, stress }) => {
      panel.querySelectorAll<SVGGElement>(`svg g.${muscle}`).forEach((group) => {
        group.classList.add(stress === "HIGH" ? "is-high" : "is-low");
      });
    });
  }, [exercise]);

  return (
    <figure ref={panelRef} className={styles.panel}>
      <figcaption className={styles.caption}>{label}</figcaption>
      <div className={styles.map} aria-hidden="true">
        <SvgComponent className={styles.svg} focusable="false" />
      </div>
    </figure>
  );
}
