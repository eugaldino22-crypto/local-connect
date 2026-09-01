import { Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";

/** Versão estática usada na Home: leva para a tela de busca. */
export function SearchEntry() {
  return (
    <div className="px-5">
      <Link
        to="/buscar"
        className="press flex h-14 items-center gap-3 rounded-3xl bg-surface px-5 shadow-card"
      >
        <Search className="size-5 shrink-0 text-primary" strokeWidth={2.4} />
        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
          Buscar lojas, pratos ou produtos...
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
          <SlidersHorizontal className="size-[18px]" />
        </span>
      </Link>
    </div>
  );
}

/** Campo controlado usado na tela de busca. */
export function SearchBar({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="flex h-13 items-center gap-3 rounded-3xl bg-surface px-5 shadow-card">
      <Search className="size-5 shrink-0 text-primary" strokeWidth={2.4} />
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar lojas, pratos ou produtos..."
        aria-label="Buscar lojas, pratos ou produtos"
        className="min-w-0 flex-1 bg-transparent py-4 text-sm font-medium outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
