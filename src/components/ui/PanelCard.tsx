import type { HTMLAttributes, PropsWithChildren } from "react";
import { cls } from "../../lib/cls.js";
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
  return (
    <Tag
      className={cls(styles.surface, { [styles.allowOverflow]: allowOverflow }, className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
