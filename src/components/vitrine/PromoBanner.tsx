import { Link } from "@tanstack/react-router";
import { useState } from "react";

import bannerOfertas from "@/assets/banner-ofertas.jpg";
import coverDoces from "@/assets/merchant-doces.jpg";
import coverMercado from "@/assets/merchant-mercado.jpg";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: "ofertas",
    badge: "Até -40% hoje",
    title: "Descontos especiais",
    subtitle: "Promoções exclusivas perto de você",
    image: bannerOfertas,
  },
  {
    id: "mercado",
    badge: "Entrega em 20 min",
    title: "Mercado no mesmo dia",
    subtitle: "Hortifrúti fresco do seu bairro",
    image: coverMercado,
  },
  {
    id: "doces",
    badge: "Frete grátis",
    title: "Doces e açaí",
    subtitle: "Sobremesa gelada sem taxa de entrega",
    image: coverDoces,
  },
];

export function PromoBanner() {
  const [index, setIndex] = useState(0);
  const active = slides[index] ?? slides[0]!;

  return (
    <section className="px-5" aria-label="Promoções">
      <div className="relative overflow-hidden rounded-4xl bg-foreground shadow-card">
        <img
          src={active.image}
          alt={active.title}
          width={1200}
          height={640}
          className="h-44 w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="inline-flex rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
            {active.badge}
          </span>
          <h3 className="mt-2 text-xl font-bold text-background">
            {active.title}
          </h3>
          <p className="text-xs text-background/80">{active.subtitle}</p>
          <Link
            to="/buscar"
            search={{ filtro: "ofertas" }}
            className="press mt-3 inline-flex h-10 items-center rounded-full bg-background px-4 text-xs font-bold text-foreground"
          >
            Ver ofertas
          </Link>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Ver promoção ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-primary" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>
    </section>
  );
}
