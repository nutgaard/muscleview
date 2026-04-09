import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { cls } from "../../lib/cls.js";
import styles from "./ActionLink.module.css";

export function ActionLink({
  className,
  children,
  rel,
  target,
  ...props
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a
      className={cls(styles.link, className)}
      target={target ?? "_blank"}
      rel={rel ?? "noreferrer noopener"}
      {...props}
    >
      {children}
    </a>
  );
}
