import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cls } from "../../lib/cls.js";
import styles from "./InfoPill.module.css";

type InfoPillTone = "default" | "muscle" | "equipment";

type InfoPillOwnProps<T extends ElementType> = {
  as?: T;
  interactive?: boolean;
  tone?: InfoPillTone;
};

type InfoPillProps<T extends ElementType = "span"> = InfoPillOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof InfoPillOwnProps<T>>;

export function InfoPill<T extends ElementType = "span">({
  as,
  interactive = false,
  tone = "default",
  className,
  children,
  ...props
}: InfoPillProps<T>) {
  const Tag = (as ?? "span") as ElementType;
  const toneClassName =
    tone === "equipment" ? styles.equipment : tone === "muscle" ? styles.muscle : styles.default;

  return (
    <Tag
      className={cls(styles.pill, toneClassName, { [styles.interactive]: interactive }, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
