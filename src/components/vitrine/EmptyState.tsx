import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mx-5 my-8 rounded-3xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-[28ch] text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="press mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && (
        <button
          type="button"
          onClick={onAction}
          className="press mt-5 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
