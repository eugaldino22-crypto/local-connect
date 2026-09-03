import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, ChevronDown, MapPin, Search, X } from "lucide-react";

import { cities } from "@/data/catalog";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/hooks/use-auth";

export function LocationHeader() {
  const {
    city,
    setCity,
    userLocation,
    locationStatus,
    requestLocation,
    avatarUrl,
  } = useApp();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const addressInputRef = useRef<HTMLInputElement>(null);

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  const currentAvatar =
    user?.user_metadata?.avatar_url || user?.avatar_url || avatarUrl;
  const userName = user?.user_metadata?.full_name || user?.email || "Visitante";
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="press flex items-center gap-2 min-w-0 text-left"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <span>Entrega em</span>
              <ChevronDown className="size-3.5" />
            </div>
            <p className="truncate text-sm font-bold text-foreground">
              {city ? `${city.name}, ${city.state}` : "Selecione sua cidade"}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/notificacoes"
            className="press grid size-10 place-items-center rounded-2xl bg-surface shadow-soft text-foreground"
            aria-label="Notificações"
          >
            <Bell className="size-5" />
          </Link>

          <Link
            to="/perfil"
            className="press grid size-10 place-items-center overflow-hidden rounded-2xl bg-foreground text-sm font-bold text-background shadow-soft"
            aria-label="Perfil"
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
          </Link>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="w-full max-w-lg rounded-t-3xl bg-background p-6 shadow-xl sm:rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Onde você está?</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid size-8 place-items-center rounded-full bg-accent text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  requestLocation();
                  setIsOpen(false);
                }}
                className="press flex w-full items-center gap-3 rounded-2xl bg-primary/10 p-3.5 text-primary"
              >
                <MapPin className="size-5" />
                <div className="text-left min-w-0 flex-1">
                  <p className="text-sm font-bold">Usar minha localização atual</p>
                  <p className="text-xs opacity-80 truncate">
                    {locationStatus === "granted" && userLocation
                      ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                      : "Clique para permitir o acesso à localização"}
                  </p>
                </div>
              </button>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={addressInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cidade..."
                  className="w-full rounded-2xl bg-surface pl-10 pr-4 py-3 text-sm font-medium outline-none shadow-soft placeholder:text-muted-foreground"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {filteredCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCity(c);
                      setIsOpen(false);
                    }}
                    className={`press flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      city?.id === c.id
                        ? "bg-primary text-primary-foreground font-bold"
                        : "hover:bg-accent"
                    }`}
                  >
                    <span>
                      {c.name} - {c.state}
                    </span>
                    {city?.id === c.id && <MapPin className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
