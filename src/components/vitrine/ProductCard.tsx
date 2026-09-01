import { Plus } from "lucide-react";

import { FavoriteButton } from "./FavoriteButton";
import { formatBRL } from "@/lib/format";
import type { Product } from "@/types";

export function ProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (product: Product) => void;
}) {
  return (
    <article className="relative">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="press flex w-full items-center gap-3 rounded-3xl bg-surface p-3 text-left shadow-soft"
      >
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {product.description}
          </p>
          <p className="mt-2 text-sm font-bold text-primary">
            {formatBRL(product.price)}
          </p>
        </div>
        <div className="relative shrink-0">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            loading="lazy"
            className="size-[88px] rounded-2xl object-cover"
          />
          <span className="press absolute -bottom-1.5 -right-1.5 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Plus className="size-4" strokeWidth={2.6} />
          </span>
        </div>
      </button>
      <FavoriteButton
        favoriteKey={`product:${product.id}`}
        label={product.name}
        className="absolute left-2 top-2 size-8 bg-secondary/80 shadow-none"
      />
    </article>
  );
}

export function ProductRailCard({
  product,
  merchantName,
  onSelect,
}: {
  product: Product;
  merchantName: string;
  onSelect: (product: Product) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="press w-[160px] overflow-hidden rounded-3xl bg-surface text-left shadow-card"
    >
      <img
        src={product.image}
        alt={product.name}
        width={800}
        height={600}
        loading="lazy"
        className="aspect-[5/4] w-full object-cover"
      />
      <div className="p-3">
        <p className="truncate text-[11px] font-semibold text-muted-foreground">
          {merchantName}
        </p>
        <h3 className="truncate text-sm font-bold">{product.name}</h3>
        <p className="mt-1 text-sm font-bold text-primary">
          {formatBRL(product.price)}
        </p>
      </div>
    </button>
  );
}
