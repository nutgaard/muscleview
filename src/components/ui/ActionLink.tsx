import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import styles from "./ActionLink.module.css";

export function ActionLink({
  className,
  children,
  rel,
  target,
  ...props
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
  const linkClassName = className ? `${styles.link} ${className}` : styles.link;

  return (
    <a
      className={linkClassName}
      target={target ?? "_blank"}
      rel={rel ?? "noreferrer noopener"}
      {...props}
    >
      {children}
    </a>
  );
}
