import type { FinderMode } from "../muscle-view.ts";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  finderMode: FinderMode;
  setFinderMode: Dispatch<SetStateAction<FinderMode>>;
};

export function FinderSelector({ finderMode, setFinderMode }: Props) {
  return (
    <div className="finder-tabs" role="tablist" aria-label="Finder mode">
      <button
        type="button"
        role="tab"
        aria-selected={finderMode === "exercise"}
        className={finderMode === "exercise" ? "finder-tab is-active" : "finder-tab"}
        onClick={() => {
          setFinderMode("exercise");
        }}
      >
        Exercise lookup
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={finderMode === "muscle"}
        className={finderMode === "muscle" ? "finder-tab is-active" : "finder-tab"}
        onClick={() => {
          setFinderMode("muscle");
        }}
      >
        Muscle groups
      </button>
    </div>
  );
}
