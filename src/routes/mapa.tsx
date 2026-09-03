import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { MapView } from "@/components/vitrine/MapView";
import { MerchantCard } from "@/components/vitrine/MerchantCard";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { categories, listMerchants } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de estabelecimentos — Vitrine Local" },
      {
        name: "description",
        content:
          "Veja no mapa restaurantes, mercados, farmácias e lojas próximas de você na sua cidade.",
      },
      { property: "og:title", content: "Mapa de estabelecimentos — Vitrine Local" },
      {
        property: "og:description",
        content: "Descubra o comércio local no mapa e peça em poucos toques.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { city } = useApp();
  const merchants = listMerchants();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    merchants[0]?.id ?? null,
  );

  const filtered = categoryId
    ? merchants.filter((m) => m.categoryId === categoryId)
    : merchants;
  const active = filtered.find((m) => m.id === activeId) ?? filtered[0];

  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="relative mx-auto min-h-screen w-full max-w-[460px] overflow-hidden bg-background shadow-soft">
        <PageHeader
          title="Perto de você"
          subtitle={city ? `${city.name} · ${city.state}` : "Cidade não definida"}
        />

        <div className="rail absolute inset-x-0 top-[68px] z-20 gap-2 px-4 py-3">
          {categories.slice(0, 6).map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={categoryId === category.id}
              onClick={() =>
                setCategoryId(categoryId === category.id ? null : category.id)
              }
              className={cn(
                "press h-9 rounded-full bg-surface px-3.5 text-xs font-bold shadow-soft",
                categoryId === category.id &&
                  "bg-primary text-primary-foreground",
              )}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>

        <div className="h-[calc(100vh-68px)]">
          <MapView
            merchants={filtered}
            activeId={active?.id ?? null}
            onSelect={setActiveId}
            cityLabel={city ? `${city.name} · ${city.state}` : "sua região"}
          />
        </div>

        {active && (
          <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6">
            <MerchantCard merchant={active} variant="row" />
            <Link
              to="/buscar"
              className="press mt-3 flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background"
            >
              Ver lista completa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
