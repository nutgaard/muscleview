import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type SurfacePanelProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: "section" | "aside" | "article" | "div";
  }
>;

export function SurfacePanel({
  as: Tag = "section",
  className,
  children,
  ...props
}: SurfacePanelProps) {
  return (
    <Tag className={cx("ds-surface", className)} {...props}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("ds-heading", className)}>
      {eyebrow ? <p className="ds-eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="ds-title">{title}</h2> : null}
      {description ? <p className="ds-description">{description}</p> : null}
    </div>
  );
}

export function SearchField({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <label className={cx("ds-field", className)}>
      <span className="ds-field-label">{label}</span>
      <input className="ds-field-input" type="search" {...props} />
    </label>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: PropsWithChildren<
  SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
  }
>) {
  return (
    <label className={cx("ds-field", className)}>
      <span className="ds-field-label">{label}</span>
      <select className="ds-field-input ds-field-select" {...props}>
        {children}
      </select>
    </label>
  );
}

export function ActionLink({
  className,
  children,
  rel,
  target,
  ...props
}: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) {
  return (
    <a
      className={cx("ds-action-link", className)}
      target={target ?? "_blank"}
      rel={rel ?? "noreferrer noopener"}
      {...props}
    >
      {children}
    </a>
  );
}

export function ChipButton({
  active,
  count,
  className,
  children,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean;
    count?: number;
  }
>) {
  return (
    <button
      type="button"
      className={cx("ds-chip-button", active && "is-active", className)}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined ? <small>{count}</small> : null}
    </button>
  );
}

export function InfoPill({
  className,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span className={cx("ds-info-pill", className)} {...props}>
      {children}
    </span>
  );
}
