import { useMemo } from "react";
import { SurfacePanel } from "../design-system.js";
import { exercises } from "../exercises.js";

export function HeroPanel() {
  const muscleCount = useMemo(() => {
    const muscles = exercises.flatMap((it) => it.muscleGroups).map((it) => it.muscle);
    return new Set(muscles).size;
  }, []);

  return (
    <SurfacePanel className="hero-panel">
      <div className="hero-copy">
        <p className="hero-kicker">Exercise atlas</p>
        <h1 className="hero-title">See what each lift actually trains.</h1>
        <p className="hero-intro">
          A visual index for {exercises.length} exercises across {muscleCount} tracked muscles.
          Search by exercise name, narrow by muscle, and read the result directly on the body map.
        </p>
      </div>
    </SurfacePanel>
  );
}
