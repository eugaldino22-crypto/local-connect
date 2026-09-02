import { createFileRoute } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/vitrine/AppShell";
import { CategoryCarousel } from "@/components/vitrine/CategoryCarousel";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { LocationHeader } from "@/components/vitrine/LocationHeader";
import { MerchantCard, MerchantCarousel } from "@/components/vitrine/MerchantCard";
import { ProductRailCard } from "@/components/vitrine/ProductCard";
import { ProductSheet } from "@/components/vitrine/ProductSheet";
import { PromoBanner } from "@/components/vitrine/PromoBanner";
import { SearchEntry } from "@/components/vitrine/SearchBar";
import { SectionHeader } from "@/components/vitrine/SectionHeader";
import {
  categories,
  getMerchantById,
  listOffers,
  listPopularProducts,
  listPopular,
} from "@/data/catalog";
import { useApp } from "@/store/app-store";
import type { Product } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitrine Local — Encontre tudo que existe perto de você" },
      {
        name: "description",
        content:
          "Marketplace local com delivery de restaurantes, mercados, farmácias e lojas do seu bairro. Peça em minutos no Vitrine Local.",
      },
      {
        property: "og:title",
        content: "Vitrine Local — Encontre tudo que existe perto de você",
      },
      {
        property: "og:description",
        content:
          "Restaurantes, mercados, farmácias e lojas da sua cidade com entrega rápida.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { city } = useApp();
  const [selected, setSelected] = useState<Product | null>(null);

  const offers = listOffers();
  const popular = listPopular();
  const popularProducts = listPopularProducts();

  return (
    <AppShell>
      <LocationHeader />

      <section className="px-5 pt-1 pb-4">
        <p className="text-sm font-semibold text-muted-foreground">Olá 👋</p>
        <h1 className="mt-1 text-[28px] leading-tight font-extrabold">
          O que você quer
          <br />
          pedir hoje?
        </h1>
      </section>

      <SearchEntry />

      <section className="mt-6">
        <SectionHeader title="Categorias" actionTo="/categorias" />
        <CategoryCarousel categories={categories} />
      </section>

      <div className="mt-3">
        <PromoBanner />
      </div>

      <section className="mt-6">
        <SectionHeader
          title="Ofertas perto de você"
          actionTo="/buscar"
        />
        {offers.length > 0 ? (
          <MerchantCarousel merchants={offers} />
        ) : (
          <EmptyState
            icon={Store}
            title="Nenhuma oferta agora"
            description="Assim que houver promoções na sua região elas aparecem aqui."
            actionLabel="Ver todas as lojas"
            actionTo="/buscar"
          />
        )}
      </section>

      <section className="mt-4">
        <SectionHeader title="Mais pedidos" actionTo="/buscar" />
        <div className="rail gap-3 px-5 py-3">
          {popularProducts.map((product) => (
            <ProductRailCard
              key={product.id}
              product={product}
              merchantName={getMerchantById(product.merchantId)?.name ?? ""}
              onSelect={setSelected}
            />
          ))}
        </div>
      </section>

      <section className="mt-4">
        <SectionHeader title="Populares na sua cidade" actionTo="/mapa" actionLabel="Ver mapa" />
        <div className="space-y-3 px-5 pt-3">
          {popular.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} variant="row" />
          ))}
        </div>
        <p className="px-5 pt-4 text-xs text-muted-foreground">
          {city
            ? `Mostrando estabelecimentos em ${city.name} · ${city.state}.`
            : "Escolha sua cidade para ver estabelecimentos próximos."}
        </p>
      </section>

      <ProductSheet
        product={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </AppShell>
  );
}
