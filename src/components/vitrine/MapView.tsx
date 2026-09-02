import { Crosshair, Navigation } from "lucide-react";

import mapPlaceholder from "@/assets/map-placeholder.jpg";
import type { Merchant } from "@/types";

/**
 * Placeholder visual do mapa. A estrutura já recebe os estabelecimentos e a
 * posição do usuário — basta trocar a imagem por um mapa real depois.
 */
export function MapView({
  merchants,
  activeId,
  onSelect,
  cityLabel,
}: {
  merchants: Merchant[];
  activeId: string | null;
  onSelect: (id: string) => void;
  cityLabel: string;
}) {
  const pins = merchants.slice(0, 6);

  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary">
      <img
        src={mapPlaceholder}
        alt={`Mapa de estabelecimentos em ${cityLabel}`}
        width={900}
        height={1200}
        className="h-full w-full object-cover"
      />

      <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
        <Navigation className="size-5 fill-primary-foreground" />
      </span>

      {pins.map((merchant, index) => {
        const positions = [
          { top: "18%", left: "22%" },
          { top: "26%", left: "68%" },
          { top: "44%", left: "12%" },
          { top: "58%", left: "74%" },
          { top: "70%", left: "34%" },
          { top: "82%", left: "58%" },
        ];
        const pos = positions[index] ?? positions[0]!;
        const active = merchant.id === activeId;
        return (
          <button
            key={merchant.id}
            type="button"
            onClick={() => onSelect(merchant.id)}
            aria-label={`Ver ${merchant.name} no mapa`}
            style={{ top: pos.top, left: pos.left }}
            className={`press absolute grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-base shadow-soft ring-2 ring-background ${
              active ? "bg-primary text-primary-foreground" : "bg-surface"
            }`}
          >
            {merchant.logoEmoji}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Centralizar no meu local"
        className="press absolute bottom-4 right-4 grid size-11 place-items-center rounded-2xl bg-surface shadow-card"
      >
        <Crosshair className="size-5" />
      </button>
    </div>
  );
}
