import { useState, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Search, MapPin, X, ChevronDown, Bell } from "lucide-react";
import { useApp } from "@/store/app-store";
import { useAuth } from "@/hooks/use-auth";
import type { City } from "@/types";

export function LocationHeader() {
  const { city, setCity, locationStatus, userLocation, requestLocation, detectedLocationLabel } = useApp();
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const currentAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email || "Visitante";
  const userInitials = userName.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!search.trim() || search.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            search
          )}&countrycodes=br&limit=5`
        );
        const data = await response.json();

        const formattedCities: City[] = data.map((item: any) => ({
          id: String(item.place_id),
          name: item.display_name.split(",")[0],
          state: item.display_name.split(",").slice(-2, -1)[0]?.trim() || "BR",
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          served: true,
        }));

        setSearchResults(formattedCities);
      } catch (err) {
        console.error("Erro ao buscar cidades:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="press flex items-center gap-2 text-left"
        >
          <div className="grid size-9 place-items-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <span>Entrega em</span>
              <ChevronDown className="size-3" />
            </div>
            <p className="text-sm font-bold truncate max-w-[180px]">
              {locationStatus === "granted" && detectedLocationLabel
                ? detectedLocationLabel
                : city
                ? `${city.name}, ${city.state}`
                : "Selecione a localização"}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <Link
            to="/notificacoes"
            className="grid size-10 place-items-center rounded-2xl bg-surface text-muted-foreground shadow-soft"
          >
            <Bell className="size-5" />
          </Link>
          <Link
            to="/perfil"
            className="relative grid size-10 place-items-center overflow-hidden rounded-2xl bg-foreground text-sm font-bold text-background shadow-soft"
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
                      : "Clique para permitir o acesso ao GPS"}
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
                  placeholder="Buscar cidade ou endereço..."
                  className="w-full rounded-2xl bg-surface pl-10 pr-4 py-3 text-sm font-medium outline-none shadow-soft placeholder:text-muted-foreground"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {isSearching && (
                  <p className="p-3 text-xs text-muted-foreground text-center">Buscando localizações...</p>
                )}

                {!isSearching && searchResults.length === 0 && search.length >= 3 && (
                  <p className="p-3 text-xs text-muted-foreground text-center">Nenhum local encontrado.</p>
                )}

                {searchResults.map((c) => (
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
                        : "bg-surface hover:bg-accent"
                    }`}
                  >
                    <span>{c.name} · {c.state}</span>
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
