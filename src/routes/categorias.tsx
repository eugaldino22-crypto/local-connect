import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/vitrine/AppShell";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { categories, listMerchants } from "@/data/catalog";

export const Route = createFileRoute("/categorias")({
  head: () => ({
    meta: [
      { title: "Categorias — Vitrine Local" },
      {
        name: "description",
        content:
          "Navegue por lanches, pizza, mercado, farmácia, padaria, doces, lojas e bebidas na sua cidade.",
      },
      { property: "og:title", content: "Categorias — Vitrine Local" },
      {
        property: "og:description",
        content: "Todas as categorias de estabelecimentos locais em um só lugar.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const merchants = listMerchants();

  return (
    <AppShell>
      <PageHeader title="Categorias" subtitle="Escolha por onde começar" />
      <ul className="grid grid-cols-2 gap-3 p-5">
        {categories.map((category) => {
          const count = merchants.filter(
            (m) => m.categoryId === category.id,
          ).length;
          return (
            <li key={category.id}>
              <Link
                to="/buscar"
                search={{ categoria: category.slug }}
                className="press flex h-full flex-col justify-between rounded-3xl bg-surface p-4 shadow-soft"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-2xl">
                  {category.emoji}
                </span>
                <span className="mt-4 block text-sm font-bold">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {count} {count === 1 ? "loja" : "lojas"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
