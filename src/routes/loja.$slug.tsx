import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bike, ChevronLeft, Star, Timer, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/vitrine/EmptyState";
import { FavoriteButton } from "@/components/vitrine/FavoriteButton";
import { ProductCard } from "@/components/vitrine/ProductCard";
import { ProductSheet } from "@/components/vitrine/ProductSheet";
import { getMerchantBySlug, listProductsByMerchant } from "@/data/catalog";
import { formatBRL, formatFee, formatRating } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";
import type { Product } from "@/types";
import { UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/loja/$slug")({
  loader: ({ params }) => {
    const merchant = getMerchantBySlug(params.slug);
    if (!merchant) throw notFound();
    return { merchant };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Loja indisponível — Vitrine Local" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { merchant } = loaderData;
    const description = `${merchant.description} Entrega em ${merchant.etaMin}–${merchant.etaMax} min.`;
    return {
      meta: [
        { title: `${merchant.name} — Vitrine Local` },
        { name: "description", content: description },
        { property: "og:title", content: `${merchant.name} — Vitrine Local` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: MerchantPage,
});

function MerchantPage() {
  const { merchant } = Route.useLoaderData();
  const { cartCount, cartSubtotal } = useApp();
  const [selected, setSelected] = useState<Product | null>(null);

  const products = listProductsByMerchant(merchant.id);
  const sections = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const product of products) {
      map.set(product.menuSection, [
        ...(map.get(product.menuSection) ?? []),
        product,
      ]);
    }
    return [...map.entries()];
  }, [products]);

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-background pb-32 shadow-soft">
        <div className="relative">
          <img
            src={merchant.cover}
            alt={merchant.name}
            width={800}
            height={600}
            className="h-52 w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Link
              to="/"
              aria-label="Voltar para a Home"
              className="press grid size-10 place-items-center rounded-full bg-surface/90 backdrop-blur"
            >
              <ChevronLeft className="size-5" />
            </Link>
            <FavoriteButton
              favoriteKey={`merchant:${merchant.id}`}
              label={merchant.name}
            />
          </div>
        </div>

        <div className="-mt-8 rounded-t-4xl bg-background px-5 pt-5">
          <div className="flex items-start gap-3">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent text-2xl shadow-soft">
              {merchant.logoEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-extrabold">{merchant.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-warning text-warning" />
                <span className="font-bold text-foreground">
                  {formatRating(merchant.rating)}
                </span>
                ({merchant.reviews}) · {merchant.categoryName}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold",
                merchant.isOpen
                  ? "bg-success/15 text-success"
                  : "bg-secondary text-muted-foreground",
              )}
            >
              {merchant.isOpen ? "Aberto" : "Fechado"}
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-2 rounded-3xl bg-surface p-3 shadow-soft">
            <li className="text-center">
              <Timer className="mx-auto size-4 text-primary" />
              <p className="mt-1 text-[11px] font-bold">
                {merchant.etaMin}–{merchant.etaMax} min
              </p>
              <p className="text-[10px] text-muted-foreground">Entrega</p>
            </li>
            <li className="text-center">
              <Bike className="mx-auto size-4 text-primary" />
              <p className="mt-1 text-[11px] font-bold">
                {formatFee(merchant.deliveryFee)}
              </p>
              <p className="text-[10px] text-muted-foreground">Taxa</p>
            </li>
            <li className="text-center">
              <Wallet className="mx-auto size-4 text-primary" />
              <p className="mt-1 text-[11px] font-bold">
                {merchant.minOrder === 0 ? "Sem mínimo" : formatBRL(merchant.minOrder)}
              </p>
              <p className="text-[10px] text-muted-foreground">Pedido mínimo</p>
            </li>
          </ul>

          <p className="mt-4 text-sm text-muted-foreground">
            {merchant.description}
          </p>
        </div>

        {sections.length > 0 ? (
          <>
            <div className="rail mt-5 gap-2 px-5">
              {sections.map(([section]) => (
                <span
                  key={section}
                  className="h-9 rounded-full border border-border bg-surface px-4 text-xs font-bold leading-9"
                >
                  {section}
                </span>
              ))}
            </div>

            {sections.map(([section, items]) => (
              <section key={section} className="mt-6 px-5">
                <h2 className="text-base font-bold">{section}</h2>
                <div className="mt-3 space-y-3">
                  {items.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : (
          <EmptyState
            icon={UtensilsCrossed}
            title="Cardápio em atualização"
            description="Esta loja ainda não publicou produtos. Volte em breve."
          />
        )}

        <ProductSheet
          product={selected}
          onOpenChange={(open) => !open && setSelected(null)}
        />
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
          <Link
            to="/carrinho"
            className="press flex h-14 w-full max-w-[430px] items-center justify-between rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-glow"
          >
            <span>
              Ver carrinho · {cartCount} {cartCount === 1 ? "item" : "itens"}
            </span>
            <span>{formatBRL(cartSubtotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
