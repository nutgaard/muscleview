import type { InputHTMLAttributes } from "react";
import { cls } from "../../lib/cls.js";
import styles from "./SearchInput.module.css";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function SearchInput({ label, className, ...props }: SearchInputProps) {
  return (
    <label className={cls(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      <input className={styles.input} type="search" {...props} />
    </label>
  );
}
