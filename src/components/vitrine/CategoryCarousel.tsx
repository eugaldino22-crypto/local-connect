import { CakeSlice, CupSoda, Hamburger, Pill, Pizza, ShoppingBag, ShoppingCart, Wheat, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? ShoppingBag;
}

const categoryIcons: Record<string, LucideIcon> = {
  lanches: Hamburger,
  pizza: Pizza,
  mercado: ShoppingCart,
  farmacia: Pill,
  padaria: Wheat,
  doces: CakeSlice,
  lojas: ShoppingBag,
  bebidas: CupSoda,
};

export function CategoryCard({
  category,
  active,
  onClick,
}: {
  category: Category;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = getCategoryIcon(category.slug);
  const content = (
    <>
      <span
        className={cn(
          "grid size-16 place-items-center rounded-full bg-surface text-2xl shadow-soft ring-1 ring-border",
          active && "bg-primary text-primary-foreground ring-primary",
        )}
      >
        <Icon className="size-7" strokeWidth={2} />
      </span>
      <span className="w-16 truncate text-center text-[11px] font-bold">
        {category.name}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className="press flex flex-col items-center gap-2"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to="/buscar"
      search={{ categoria: category.slug }}
      className="press flex flex-col items-center gap-2"
    >
      {content}
    </Link>
  );
}

export function CategoryCarousel({ categories }: { categories: Category[] }) {
  return (
    <div className="rail gap-4 px-5 py-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
