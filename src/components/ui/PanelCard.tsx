import type { HTMLAttributes, PropsWithChildren } from "react";
import styles from "./PanelCard.module.css";

type PanelCardProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "section" | "aside" | "article" | "div";
    allowOverflow?: boolean;
  }
>;

export function PanelCard({
  as: Tag = "section",
  className,
  children,
  allowOverflow = false,
  ...props
}: PanelCardProps) {
  const baseClassName = allowOverflow
    ? `${styles.surface} ${styles.allowOverflow}`
    : styles.surface;
  const panelClassName = className ? `${baseClassName} ${className}` : baseClassName;

  return (
    <Tag className={panelClassName} {...props}>
      {children}
    </Tag>
  );
}
