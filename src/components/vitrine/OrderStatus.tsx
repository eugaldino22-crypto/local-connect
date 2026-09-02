import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { OrderStatusStep } from "@/types";

const steps: { id: OrderStatusStep; title: string; description: string }[] = [
  { id: "confirmed", title: "Pedido confirmado", description: "A loja recebeu seu pedido" },
  { id: "preparing", title: "Preparando", description: "Seu pedido está sendo preparado" },
  { id: "dispatched", title: "Saiu para entrega", description: "O pedido deixou a loja" },
  { id: "arriving", title: "Entregador a caminho", description: "Chegando no seu endereço" },
  { id: "delivered", title: "Entregue", description: "Bom apetite!" },
];

export function OrderStatus({ current }: { current: OrderStatusStep }) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <ol className="px-5">
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full border-2 border-border bg-surface text-xs font-bold text-muted-foreground",
                  done && "border-success bg-success text-success-foreground",
                  active && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {done ? <Check className="size-4" /> : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={cn(
                    "my-1 w-0.5 flex-1 rounded-full bg-border",
                    done && "bg-success",
                  )}
                />
              )}
            </div>
            <div className={cn("pb-6", index === steps.length - 1 && "pb-0")}>
              <p
                className={cn(
                  "text-sm font-bold",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
