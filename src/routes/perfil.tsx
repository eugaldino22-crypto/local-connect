import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  ReceiptText,
  Store,
} from "lucide-react";

import { AppShell } from "@/components/vitrine/AppShell";
import { savedAddresses } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import type { LinkProps } from "@tanstack/react-router";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Vitrine Local" },
      {
        name: "description",
        content:
          "Gerencie endereços, favoritos, formas de pagamento e preferências da sua conta no Vitrine Local.",
      },
      { property: "og:title", content: "Meu perfil — Vitrine Local" },
      {
        property: "og:description",
        content: "Endereços, favoritos e pagamentos em um só lugar.",
      },
    ],
  }),
  component: ProfilePage,
});

type Item = {
  label: string;
  description: string;
  icon: typeof Heart;
  to?: NonNullable<LinkProps["to"]>;
};

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Minha conta",
    items: [
      {
        label: "Favoritos",
        description: "Lojas e produtos salvos",
        icon: Heart,
        to: "/favoritos",
      },
      {
        label: "Meus pedidos",
        description: "Histórico e acompanhamento",
        icon: ReceiptText,
        to: "/pedidos",
      },
      {
        label: "Endereços",
        description: "Locais de entrega salvos",
        icon: MapPin,
      },
      {
        label: "Formas de pagamento",
        description: "Pix, cartões e dinheiro",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "Preferências",
    items: [
      {
        label: "Notificações",
        description: "Promoções e status de pedidos",
        icon: Bell,
      },
      {
        label: "Ajuda e suporte",
        description: "Fale com a nossa equipe",
        icon: HelpCircle,
      },
      {
        label: "Quero vender no Vitrine Local",
        description: "Cadastre seu comércio",
        icon: Store,
      },
    ],
  },
];

function ProfilePage() {
  const { city, favorites } = useApp();
  const address = savedAddresses[0];

  return (
    <AppShell>
      <header className="px-5 pt-6">
        <div className="flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-foreground text-lg font-bold text-background">
            VL
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">Visitante</h1>
            <p className="truncate text-sm text-muted-foreground">
              {city ? `${city.name} · ${city.state}` : "Cidade não definida"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-surface p-4 shadow-soft">
            <p className="text-xl font-bold">{favorites.length}</p>
            <p className="text-xs text-muted-foreground">Favoritos</p>
          </div>
          <div className="rounded-3xl bg-surface p-4 shadow-soft">
            <p className="truncate text-sm font-bold">
              {address ? `${address.street}, ${address.number}` : "Sem endereço"}
            </p>
            <p className="text-xs text-muted-foreground">Endereço principal</p>
          </div>
        </div>
      </header>

      {groups.map((group) => (
        <section key={group.title} className="mt-6 px-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            {group.title}
          </h2>
          <ul className="mt-2 overflow-hidden rounded-3xl bg-surface shadow-soft">
            {group.items.map((item) => {
              const content = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
                    <item.icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </>
              );

              return (
                <li key={item.label} className="border-b border-border last:border-0">
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="press flex items-center gap-3 px-4 py-3.5"
                    >
                      {content}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="press flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <div className="px-5 pt-6">
        <button
          type="button"
          className="press flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface text-sm font-bold text-muted-foreground"
        >
          <LogOut className="size-4" /> Sair da conta
        </button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Vitrine Local · versão de demonstração
        </p>
      </div>
    </AppShell>
  );
}
