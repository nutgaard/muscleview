import {Activity, type Dispatch, type SetStateAction, useEffect, useMemo, useState} from "react";
import type {ExerciseData, ExerciseId} from "../exercises.js";
import {exercises} from "../exercises.js";
import {InfoPill, SearchField, SelectField, SurfacePanel} from "../design-system.js";
import {
    buildMuscleOptions,
    type FinderMode,
    formatLabel,
    matchesExerciseQuery,
    type MuscleFilter
} from "../muscle-view.js";
import {FinderSelector} from "./FinderSelector.tsx";

type FinderPanelProps = {
    currentExerciseId: ExerciseId;
    setCurrentExerciseId: Dispatch<SetStateAction<ExerciseId>>;
    filteredExercises: ExerciseData[];
    setFilteredExercises: Dispatch<SetStateAction<ExerciseData[]>>
};
type SearchFilterProps = {
    filteredExercises: ExerciseData[];
    setFilteredExercises: Dispatch<SetStateAction<ExerciseData[]>>
};

function Search({setFilteredExercises}: SearchFilterProps) {
    const [exerciseQuery, setExerciseQuery] = useState("");
    useEffect(() => {
        const normalizedExerciseQuery = exerciseQuery.trim().toLowerCase();
        const exerciseSearchResults = exercises.filter((exercise) =>
            matchesExerciseQuery(exercise, normalizedExerciseQuery),
        );
        setFilteredExercises(exerciseSearchResults);
    }, [exerciseQuery, setFilteredExercises]);

    return (
        <div className="finder-pane" role="tabpanel">
            <SearchField
                label="Search"
                value={exerciseQuery}
                onChange={(event) => {
                    setExerciseQuery(event.target.value);
                }}
                placeholder="Bench press, row, squat..."
            />
        </div>
    );
}

function MuscleFilter({setFilteredExercises}: SearchFilterProps) {
    const muscleOptions = useMemo(() => buildMuscleOptions(exercises), []);
    const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleFilter>("ALL");

    useEffect(() => {
        const muscleFilteredExercises = exercises.filter(
            (exercise) =>
                selectedMuscleFilter === "ALL" ||
                exercise.muscleGroups.some(({muscle}) => muscle === selectedMuscleFilter),
        );
        setFilteredExercises(muscleFilteredExercises);
    }, [setFilteredExercises, selectedMuscleFilter]);

    return (
        <div className="finder-pane" role="tabpanel">
            <SelectField
                label="Choose muscle group"
                value={selectedMuscleFilter}
                onChange={(event) => {
                    setSelectedMuscleFilter(event.target.value as MuscleFilter);
                }}
            >
                <option value="ALL">All muscles ({exercises.length})</option>
                {muscleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label} ({option.count})
                    </option>
                ))}
            </SelectField>
        </div>
    );
}

export function FinderPanel(props: FinderPanelProps) {
    const [finderMode, setFinderMode] = useState<FinderMode>("exercise");


    return (
        <SurfacePanel className="rail-stack rail-stack-finder exercise-rail">
            <div className="panel-heading">
                <p className="panel-kicker">Exercise index</p>
            </div>

            <FinderSelector finderMode={finderMode} setFinderMode={setFinderMode}/>

            <Activity mode={finderMode === "exercise" ? "visible" : "hidden"}>
                <Search {...props} />
            </Activity>
            <Activity mode={finderMode === "muscle" ? "visible" : "hidden"}>
                <MuscleFilter {...props} />
            </Activity>

            <div className="finder-results-header">
                <p className="finder-label">Matching exercises({props.filteredExercises.length})</p>
            </div>

            <div className="exercise-list">
                {props.filteredExercises.map((exercise) => (
                    <button
                        key={exercise.id}
                        type="button"
                        className={
                            exercise.id === props.currentExerciseId ? "exercise-card is-active" : "exercise-card"
                        }
                        onClick={() => {
                            props.setCurrentExerciseId(exercise.id);
                        }}
                    >
                        <div className="exercise-card-top">
                            <strong>{exercise.name}</strong>
                            <span>{formatLabel(exercise.muscleType.toLowerCase())}</span>
                        </div>
                        <p>{formatLabel(exercise.movementType.toLowerCase())}</p>
                        <div className="exercise-card-muscles">
                            {exercise.muscleGroups
                                .filter(({stress}) => stress === "HIGH")
                                .map(({muscle}) => (
                                    <InfoPill key={`${exercise.id}-${muscle}`}>{formatLabel(muscle)}</InfoPill>
                                ))}
                        </div>
                    </button>
                ))}
            </div>
        </SurfacePanel>
    );
}
