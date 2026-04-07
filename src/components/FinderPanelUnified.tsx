import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ExerciseData, ExerciseId } from "../exercises.js";
import { exercises } from "../exercises.js";
import { InfoPill, SearchField, SurfacePanel } from "../design-system.js";
import {
  buildMuscleOptions,
  buildWeightTypeOptions,
  formatLabel,
  matchesAnySelection,
  matchesExerciseQuery,
} from "../muscle-view.js";
import type { Muscle, WeightType } from "../types.js";

type FinderPanelUnifiedProps = {
  currentExerciseId: ExerciseId;
  setCurrentExerciseId: Dispatch<SetStateAction<ExerciseId>>;
  filteredExercises: ExerciseData[];
  setFilteredExercises: Dispatch<SetStateAction<ExerciseData[]>>;
};

type FilterOption<T extends string> = {
  value: T;
  label: string;
  count: number;
};

type MultiSelectFieldProps<T extends string> = {
  label: string;
  accent: "muscle" | "equipment";
  options: readonly FilterOption<T>[];
  selectedValues: readonly T[];
  onToggleValue: (value: T) => void;
  onClear: () => void;
};

function MultiSelectField<T extends string>({
  label,
  accent,
  options,
  selectedValues,
  onToggleValue,
  onClear,
}: MultiSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const fieldId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={panelRef} className="finder-filter-control">
      <div className="ds-field">
        <span className="ds-field-label">{label}</span>
        <button
          id={fieldId}
          type="button"
          className={open ? "finder-filter-trigger is-open" : "finder-filter-trigger"}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${fieldId}-menu`}
          onClick={() => {
            setOpen((current) => !current);
          }}
        >
          <span className="finder-filter-trigger-copy">
            {selectedValues.length === 0 ? "All" : `${selectedValues.length} selected`}
          </span>
          <span className="finder-filter-trigger-meta">{label}</span>
        </button>
      </div>

      {selectedOptions.length > 0 ? (
        <div className="finder-selected-pills" aria-label={`${label} selected values`}>
          {selectedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-token is-${accent}`}
              onClick={() => {
                onToggleValue(option.value);
              }}
            >
              <span>{option.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          id={`${fieldId}-menu`}
          className="finder-filter-menu"
          role="listbox"
          aria-labelledby={fieldId}
          aria-multiselectable="true"
        >
          <div className="finder-filter-menu-scroll">
            {options.map((option) => {
              const selected = selectedValues.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? "finder-filter-option is-selected" : "finder-filter-option"}
                  onClick={() => {
                    onToggleValue(option.value);
                  }}
                >
                  <span className="finder-filter-option-check" aria-hidden="true">
                    {selected ? "●" : "○"}
                  </span>
                  <span className="finder-filter-option-label">{option.label}</span>
                  <span className="finder-filter-option-count">{option.count}</span>
                </button>
              );
            })}
          </div>

          <div className="finder-filter-menu-footer">
            <button
              type="button"
              className="finder-clear-button"
              disabled={selectedValues.length === 0}
              onClick={() => {
                onClear();
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function toggleSelection<T extends string>(currentValues: readonly T[], value: T): T[] {
  return currentValues.includes(value)
    ? currentValues.filter((currentValue) => currentValue !== value)
    : [...currentValues, value];
}

export function FinderPanelUnified({
  currentExerciseId,
  setCurrentExerciseId,
  setFilteredExercises,
}: FinderPanelUnifiedProps) {
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

  const activeFilterCount =
    Number(exerciseQuery.trim().length > 0) +
    Number(selectedMuscles.length > 0) +
    Number(selectedWeightTypes.length > 0);

  useEffect(() => {
    setFilteredExercises(visibleExercises);
  }, [setFilteredExercises, visibleExercises]);

  return (
    <SurfacePanel className="rail-stack rail-stack-finder rail-stack-finder-unified exercise-rail">
      <div className="panel-heading">
        <p className="panel-kicker">Exercise index</p>
        <p className="finder-summary">
          Search by name, then narrow by muscle and equipment without leaving the list.
        </p>
      </div>

      <div className="finder-pane">
        <SearchField
          label="Search"
          value={exerciseQuery}
          onChange={(event) => {
            setExerciseQuery(event.target.value);
          }}
          placeholder="Bench press, row, squat..."
        />
      </div>

      <div className="finder-filter-grid" aria-label="Exercise filters">
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

      <div className="finder-results-header finder-results-header-unified">
        <div>
          <p className="finder-label">Matching exercises ({visibleExercises.length})</p>
          <p className="finder-summary">
            {activeFilterCount === 0
              ? "No active filters."
              : `${activeFilterCount} filter group${activeFilterCount === 1 ? "" : "s"} active.`}
          </p>
        </div>
      </div>

      <div className="exercise-list">
        {visibleExercises.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            className={
              exercise.id === currentExerciseId ? "exercise-card is-active" : "exercise-card"
            }
            onClick={() => {
              setCurrentExerciseId(exercise.id);
            }}
          >
            <div className="exercise-card-top">
              <strong>{exercise.name}</strong>
              <div className="exercise-card-badges">
                <InfoPill className="exercise-pill-equipment">
                  {formatLabel(exercise.weightType.toLowerCase())}
                </InfoPill>
                <span>{formatLabel(exercise.muscleType.toLowerCase())}</span>
              </div>
            </div>
            <p>{formatLabel(exercise.movementType.toLowerCase())}</p>
            <div className="exercise-card-muscles">
              {exercise.muscleGroups
                .filter(({ stress }) => stress === "HIGH")
                .map(({ muscle }) => (
                  <InfoPill key={`${exercise.id}-${muscle}`}>{formatLabel(muscle)}</InfoPill>
                ))}
            </div>
          </button>
        ))}
      </div>
    </SurfacePanel>
  );
}
