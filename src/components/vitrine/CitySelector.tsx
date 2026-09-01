import { Check, Crosshair, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cities } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

export function CitySelector({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { city, selectCity, requestLocation, locationStatus } = useApp();
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    return cities
      .filter((c) => c.served)
      .filter(
        (c) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q),
      );
  }, [term]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[86vh] max-w-[460px] rounded-t-4xl border-border bg-background p-0"
      >
        <SheetHeader className="px-5 pt-5 pb-0 text-left">
          <SheetTitle className="text-xl font-bold">
            Onde você quer receber?
          </SheetTitle>
        </SheetHeader>

        <div className="px-5 pt-4">
          <label className="flex h-12 items-center gap-2.5 rounded-2xl bg-secondary px-4">
            <Search className="size-[18px] shrink-0 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Buscar cidade..."
              aria-label="Buscar cidade"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </label>

          <button
            type="button"
            onClick={requestLocation}
            className="press mt-3 flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-left"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
              <Crosshair className="size-[18px]" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Usar minha localização</span>
              <span className="block text-xs text-muted-foreground">
                {locationStatus === "denied"
                  ? "Permissão negada — libere o acesso no navegador"
                  : "Detectamos a cidade atendida mais próxima"}
              </span>
            </span>
          </button>
        </div>

        <ul className="mt-4 max-h-[46vh] overflow-y-auto px-5 pb-8">
          {results.map((item) => {
            const active = item.id === city?.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectCity(item);
                    onOpenChange(false);
                  }}
                  className="press flex w-full items-center gap-3 border-b border-border py-3.5 text-left last:border-b-0"
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-muted-foreground",
                      active && "bg-primary text-primary-foreground",
                    )}
                  >
                    <MapPin className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">
                      {item.name}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.state}
                    </span>
                  </span>
                  {active && <Check className="size-5 shrink-0 text-primary" />}
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma cidade encontrada com esse nome.
            </li>
          )}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
