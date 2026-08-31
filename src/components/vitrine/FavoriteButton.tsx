import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

export function FavoriteButton({
  favoriteKey,
  label,
  className,
}: {
  favoriteKey: string;
  label: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useApp();
  const active = isFavorite(favoriteKey);

  return (
    <button
      type="button"
      aria-label={active ? `Remover ${label} dos favoritos` : `Favoritar ${label}`}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(favoriteKey);
      }}
      className={cn(
        "press grid size-9 place-items-center rounded-full bg-surface/90 text-muted-foreground shadow-soft backdrop-blur",
        active && "text-primary",
        className,
      )}
    >
      <Heart
        className={cn("size-[18px]", active && "fill-primary")}
        strokeWidth={2.2}
      />
    </button>
  );
}
