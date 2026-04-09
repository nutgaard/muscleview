import { useEffect, useId, useRef, useState } from "react";
import styles from "./MultiSelectField.module.css";

export type FilterOption<T extends string> = {
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

export function MultiSelectField<T extends string>({
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
  const triggerClassName = open ? `${styles.trigger} ${styles.triggerOpen}` : styles.trigger;

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
    <div ref={panelRef} className={styles.control}>
      <div className={styles.anchor}>
        <label className={styles.field}>
          <span className={styles.label}>{label}</span>
          <button
            id={fieldId}
            type="button"
            className={triggerClassName}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={`${fieldId}-menu`}
            onClick={() => {
              setOpen((current) => !current);
            }}
          >
            <span className={styles.triggerCopy}>
              {selectedValues.length === 0 ? "All" : `${selectedValues.length} selected`}
            </span>
            <span className={styles.triggerMeta}>{label}</span>
          </button>
        </label>

        {open ? (
          <div
            id={`${fieldId}-menu`}
            className={styles.menu}
            role="listbox"
            aria-labelledby={fieldId}
            aria-multiselectable="true"
          >
            <div className={styles.menuScroll}>
              {options.map((option) => {
                const selected = selectedValues.includes(option.value);
                const optionClassName = selected
                  ? `${styles.option} ${styles.optionSelected}`
                  : styles.option;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={optionClassName}
                    onClick={() => {
                      onToggleValue(option.value);
                    }}
                  >
                    <span className={styles.optionCheck} aria-hidden="true">
                      {selected ? "●" : "○"}
                    </span>
                    <span className={styles.optionLabel}>{option.label}</span>
                    <span className={styles.optionCount}>{option.count}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.clearButton}
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

      {selectedOptions.length > 0 ? (
        <div className={styles.selectedPills} aria-label={`${label} selected values`}>
          {selectedOptions.map((option) => {
            const tokenClassName =
              accent === "muscle"
                ? `${styles.token} ${styles.muscleToken}`
                : `${styles.token} ${styles.equipmentToken}`;

            return (
              <button
                key={option.value}
                type="button"
                className={tokenClassName}
                onClick={() => {
                  onToggleValue(option.value);
                }}
              >
                <span>{option.label}</span>
                <span aria-hidden="true">×</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
