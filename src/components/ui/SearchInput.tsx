import type { InputHTMLAttributes } from "react";
import styles from "./SearchInput.module.css";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function SearchInput({ label, className, ...props }: SearchInputProps) {
  return (
    <label className={className ? `${styles.field} ${className}` : styles.field}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} type="search" {...props} />
    </label>
  );
}
