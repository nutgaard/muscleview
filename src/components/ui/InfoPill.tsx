import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./InfoPill.module.css";

type InfoPillProps = PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & {
    tone?: "default" | "equipment";
  }
>;

export function InfoPill({ tone = "default", className, children, ...props }: InfoPillProps) {
  const toneClassName = tone === "equipment" ? styles.equipment : styles.default;
  const pillClassName = className
    ? `${styles.pill} ${toneClassName} ${className}`
    : `${styles.pill} ${toneClassName}`;

  return (
    <span className={pillClassName} {...props}>
      {children}
    </span>
  );
}
