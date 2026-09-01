import { Link } from "@tanstack/react-router";
import { Bike, Star, Timer } from "lucide-react";

import { FavoriteButton } from "./FavoriteButton";
import { formatFee, formatDistance, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Merchant } from "@/types";

export function MerchantCard({
  merchant,
  variant = "grid",
}: {
  merchant: Merchant;
  variant?: "grid" | "rail" | "row";
}) {
  if (variant === "row") {
    return (
      <Link
        to="/loja/$slug"
        params={{ slug: merchant.slug }}
        className="press flex items-center gap-3 rounded-3xl bg-surface p-3 shadow-soft"
      >
        <img
          src={merchant.cover}
          alt={merchant.name}
          width={800}
          height={600}
          loading="lazy"
          className="size-[72px] shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="truncate text-sm font-bold">{merchant.name}</h3>
            {!merchant.isOpen && (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                Fechado
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3.5 fill-warning text-warning" />
            <span className="font-bold text-foreground">
              {formatRating(merchant.rating)}
            </span>
            · {merchant.categoryName} · {formatDistance(merchant.distanceKm)}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Timer className="size-3.5" />
            {merchant.etaMin}–{merchant.etaMax} min
            <Bike className="size-3.5" />
            <span
              className={cn(
                "font-semibold",
                merchant.deliveryFee === 0 ? "text-success" : "text-foreground",
              )}
            >
              {formatFee(merchant.deliveryFee)}
            </span>
          </p>
        </div>
        <FavoriteButton
          favoriteKey={`merchant:${merchant.id}`}
          label={merchant.name}
          className="shrink-0 bg-secondary shadow-none"
        />
      </Link>
    );
  }

  return (
    <Link
      to="/loja/$slug"
      params={{ slug: merchant.slug }}
      className={cn(
        "press block overflow-hidden rounded-3xl bg-surface shadow-card",
        variant === "rail" ? "w-[228px]" : "w-full",
      )}
    >
      <div className="relative">
        <img
          src={merchant.cover}
          alt={merchant.name}
          width={800}
          height={600}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        {merchant.discountLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
            {merchant.discountLabel}
          </span>
        )}
        {!merchant.isOpen && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-[11px] font-bold text-background">
            Fechado agora
          </span>
        )}
        <FavoriteButton
          favoriteKey={`merchant:${merchant.id}`}
          label={merchant.name}
          className="absolute right-3 top-3"
        />
      </div>
      <div className="p-4">
        <h3 className="truncate text-[15px] font-bold">{merchant.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="font-bold text-foreground">
            {formatRating(merchant.rating)}
          </span>
          · {merchant.categoryName}
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Bike className="size-4" />
          {merchant.etaMin}–{merchant.etaMax} min ·{" "}
          <span
            className={cn(
              "font-semibold",
              merchant.deliveryFee === 0 ? "text-success" : "text-foreground",
            )}
          >
            {formatFee(merchant.deliveryFee)}
          </span>
        </p>
      </div>
    </Link>
  );
}

export function MerchantCarousel({ merchants }: { merchants: Merchant[] }) {
  return (
    <div className="rail gap-4 px-5 py-3">
      {merchants.map((merchant) => (
        <MerchantCard key={merchant.id} merchant={merchant} variant="rail" />
      ))}
    </div>
  );
}
