import { createFileRoute } from "@tanstack/react-router";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/vitrine/AppShell";
import { CategoryCard } from "@/components/vitrine/CategoryCarousel";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { MerchantCard } from "@/components/vitrine/MerchantCard";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { ProductSheet } from "@/components/vitrine/ProductSheet";
import { SearchBar } from "@/components/vitrine/SearchBar";
import {
  categories,
  getMerchantById,
  searchMerchants,
  searchProducts,
} from "@/data/catalog";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product, SearchFilter } from "@/types";

type SearchParams = { q?: string; categoria?: string; filtro?: string };

const filters: { id: SearchFilter; label: string }[] = [
  { id: "proximos", label: "Mais próximos" },
  { id: "avaliados", label: "Melhor avaliados" },
  { id: "rapidos", label: "Mais rápidos" },
  { id: "taxa", label: "Menor taxa" },
  { id: "ofertas", label: "Ofertas" },
];

export const Route = createFileRoute("/buscar")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const out: SearchParams = {};
    if (typeof search.q === "string") out.q = search.q;
    if (typeof search.categoria === "string") out.categoria = search.categoria;
    if (typeof search.filtro === "string") out.filtro = search.filtro;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Buscar lojas e produtos — Vitrine Local" },
      {
        name: "description",
        content:
          "Encontre restaurantes, mercados, farmácias e produtos perto de você com filtros de distância, avaliação e taxa de entrega.",
      },
      { property: "og:title", content: "Buscar lojas e produtos — Vitrine Local" },
      {
        property: "og:description",
        content: "Busque estabelecimentos e produtos da sua cidade no Vitrine Local.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const [term, setTerm] = useState(params.q ?? "");
  const [filter, setFilter] = useState<SearchFilter | null>(
    (filters.find((f) => f.id === params.filtro)?.id ?? null) as SearchFilter | null,
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    categories.find((c) => c.slug === params.categoria)?.id ?? null,
  );
  const [selected, setSelected] = useState<Product | null>(null);

  const merchants = useMemo(
    () => searchMerchants(term, filter, categoryId),
    [term, filter, categoryId],
  );
  const productHits = useMemo(() => searchProducts(term), [term]);

  return (
    <AppShell>
      <PageHeader title="Buscar" subtitle="Lojas, pratos e produtos" />

      <div className="px-5 pt-4">
        <SearchBar value={term} onChange={setTerm} />
      </div>

      <div className="rail gap-2 px-5 py-4">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(filter === item.id ? null : item.id)}
            className={cn(
              "press h-9 rounded-full border border-border bg-surface px-4 text-xs font-bold",
              filter === item.id &&
                "border-primary bg-primary text-primary-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rail gap-4 px-5 pb-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            active={categoryId === category.id}
            onClick={() =>
              setCategoryId(categoryId === category.id ? null : category.id)
            }
          />
        ))}
      </div>

      {productHits.length > 0 && (
        <section className="px-5 pb-4">
          <h2 className="text-sm font-bold text-muted-foreground">Produtos</h2>
          <ul className="mt-2 space-y-2">
            {productHits.map((product) => (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => setSelected(product)}
                  className="press flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left shadow-soft"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {product.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {getMerchantById(product.merchantId)?.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-bold text-primary">
                    {formatBRL(product.price)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="px-5">
        <h2 className="text-sm font-bold text-muted-foreground">
          {merchants.length} estabelecimento{merchants.length === 1 ? "" : "s"}
        </h2>
        <div className="mt-3 space-y-3">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} variant="row" />
          ))}
        </div>
      </section>

      {merchants.length === 0 && productHits.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="Nada encontrado"
          description="Tente outro termo, remova filtros ou explore as categorias."
        />
      )}

      <ProductSheet
        product={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </AppShell>
  );
}
