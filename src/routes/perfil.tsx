import { useRef } from "react";
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
  Camera,
} from "lucide-react";

import { AppShell } from "@/components/vitrine/AppShell";
import { ProtectedRoute } from "@/components/protected-route";
import { savedAddresses } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/hooks/use-auth";
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
  component: ProfilePageWrapper,
});

type Item = {
  label: string;
  description: string;
  icon: typeof Heart;
  to?: NonNullable<LinkProps["to"]>;
  onClick?: () => void;
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
        to: "/buscar",
      },
      {
        label: "Formas de pagamento",
        description: "Pix, cartões e dinheiro",
        icon: CreditCard,
        to: "/buscar",
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
        to: "/notificacoes",
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

function ProfilePageWrapper() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function ProfilePage() {
  const { city, favorites, avatarUrl, setAvatarUrl, locationStatus, userLocation, detectedLocationLabel } = useApp();
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const address = savedAddresses[0];

  const currentAvatar = user?.user_metadata?.avatar_url || user?.avatar_url || avatarUrl;
  const userName = user?.user_metadata?.full_name || user?.email || "Visitante";
  const userInitials = userName.slice(0, 2).toUpperCase();

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
      }
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <AppShell>
      <header className="px-5 pt-6">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative grid size-16 place-items-center overflow-hidden rounded-full bg-foreground text-lg font-bold text-background"
              aria-label="Adicionar foto de perfil"
            >
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              ) : (
                userInitials
              )}

              <span className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-full border-2 border-background bg-primary text-primary-foreground">
                <Camera className="size-3.5" />
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">{userName}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {locationStatus === "granted" && userLocation ? detectedLocationLabel ? `📍 ${detectedLocationLabel}` : "📍 Localização atual" : city ? `${city.name} · ${city.state}` : "Localização não definida"}
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
                      onClick={item.onClick}
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
          onClick={() => signOut()}
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
