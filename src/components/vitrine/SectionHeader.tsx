import { Link, type LinkProps } from "@tanstack/react-router";

export function SectionHeader({
  title,
  actionLabel = "Ver todas",
  actionTo,
}: {
  title: string;
  actionLabel?: string;
  actionTo?: LinkProps["to"];
}) {
  return (
    <div className="flex items-end justify-between gap-3 px-5">
      <h2 className="text-[17px] font-bold">{title}</h2>
      {actionTo && (
        <Link
          to={actionTo}
          className="press text-xs font-bold text-primary"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
