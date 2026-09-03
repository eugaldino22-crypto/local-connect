import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/vitrine/AppShell";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { MerchantCard } from "@/components/vitrine/MerchantCard";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { ProductCard } from "@/components/vitrine/ProductCard";
import { ProductSheet } from "@/components/vitrine/ProductSheet";
import { getMerchantById, getProductById } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import type { Product } from "@/types";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Vitrine Local" },
      {
        name: "description",
        content:
          "Suas lojas e produtos favoritos do comércio local salvos para pedir novamente em um toque.",
      },
      { property: "og:title", content: "Favoritos — Vitrine Local" },
      {
        property: "og:description",
        content: "Lojas e produtos que você salvou no Vitrine Local.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useApp();
  const [selected, setSelected] = useState<Product | null>(null);

  const merchants = favorites
    .map((id) => getMerchantById(id))
    .filter((value): value is NonNullable<typeof value> => Boolean(value));
  const products = favorites
    .map((id) => getProductById(id))
    .filter((value): value is NonNullable<typeof value> => Boolean(value));

  const isEmpty = merchants.length === 0 && products.length === 0;

  return (
    <AppShell>
      <PageHeader
        title="Favoritos"
        subtitle="Salve o que você mais pede"
        backTo="/perfil"
      />

      {isEmpty ? (
        <EmptyState
          icon={Heart}
          title="Nada salvo ainda"
          description="Toque no coração das lojas e produtos para encontrá-los rapidamente aqui."
          actionLabel="Descobrir lojas"
          actionTo="/buscar"
        />
      ) : (
        <div className="px-5 pt-4">
          {merchants.length > 0 && (
            <section>
              <h2 className="text-[17px] font-bold">Lojas favoritas</h2>
              <ul className="mt-3 space-y-3">
                {merchants.map((merchant) => (
                  <li key={merchant.id}>
                    <MerchantCard merchant={merchant} variant="row" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {products.length > 0 && (
            <section className="mt-6">
              <h2 className="text-[17px] font-bold">Produtos favoritos</h2>
              <ul className="mt-3 grid grid-cols-2 gap-3">
                {products.map((product) => (
                  <li key={product.id}>
                    <ProductCard product={product} onSelect={setSelected} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}
