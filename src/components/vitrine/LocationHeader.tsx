import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, Loader2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

import { CitySelector } from "./CitySelector";
import { useApp } from "@/store/app-store";

export function LocationHeader() {
  const { city, locationStatus, requestLocation } = useApp();
  const [open, setOpen] = useState(false);

  // Tenta detectar a localização assim que o app abre, sem cidade fixa como fallback.
  useEffect(() => {
    if (locationStatus === "idle" && !city) requestLocation();
  }, [locationStatus, city, requestLocation]);

  const loading = locationStatus === "loading";

  const label = city
    ? `${city.name} · ${city.state}`
    : loading
      ? "Detectando sua região..."
      : locationStatus === "denied" || locationStatus === "unsupported"
        ? "Escolher cidade"
        : locationStatus === "unserved"
          ? "Região sem atendimento"
          : "Escolher cidade";

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 pt-4 pb-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Alterar endereço de entrega"
          className="press flex min-w-0 items-center gap-2.5 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <MapPin className="size-5" strokeWidth={2.3} />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Entregar em
            </span>
            <span className="flex min-w-0 items-center gap-1">
              <span className="truncate text-sm font-bold">{label}</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Notificações"
            className="press relative grid size-10 place-items-center rounded-2xl bg-secondary"
          >
            <Bell className="size-[18px]" strokeWidth={2.2} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-secondary" />
          </button>
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="press grid size-10 place-items-center rounded-2xl bg-foreground text-[13px] font-bold text-background"
          >
            VL
          </Link>
        </div>
      </div>

      {locationStatus === "unserved" && (
        <div className="mx-5 mb-3 rounded-2xl bg-accent px-4 py-3">
          <p className="text-xs font-semibold text-accent-foreground">
            Não encontramos atendimento nesta região.
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="press mt-2 inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground"
          >
            Escolher cidade
          </button>
        </div>
      )}

      <CitySelector open={open} onOpenChange={setOpen} />
    </header>
  );
}
