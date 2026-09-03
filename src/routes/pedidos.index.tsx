import { createFileRoute, Link } from "@tanstack/react-router";
import { ReceiptText } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/vitrine/AppShell";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { orders } from "@/data/catalog";
import { formatBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderState } from "@/types";

const tabs: { id: OrderState; label: string }[] = [
  { id: "andamento", label: "Em andamento" },
  { id: "concluido", label: "Concluídos" },
  { id: "cancelado", label: "Cancelados" },
];

export const Route = createFileRoute("/pedidos/")({
  head: () => ({
    meta: [
      { title: "Meus pedidos — Vitrine Local" },
      {
        name: "description",
        content:
          "Acompanhe pedidos em andamento, concluídos e cancelados feitos nas lojas da sua cidade.",
      },
      { property: "og:title", content: "Meus pedidos — Vitrine Local" },
      {
        property: "og:description",
        content: "Histórico e acompanhamento dos seus pedidos locais.",
      },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [tab, setTab] = useState<OrderState>("andamento");
  const list = orders.filter((order) => order.state === tab);

  return (
    <AppShell>
      <PageHeader title="Meus pedidos" subtitle="Histórico e acompanhamento" />

      <div className="rail gap-2 px-5 py-4">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
            className={cn(
              "press h-9 rounded-full border border-border bg-surface px-4 text-xs font-bold",
              tab === item.id && "border-primary bg-primary text-primary-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="Nenhum pedido aqui"
          description="Quando você fizer pedidos nesta situação, eles aparecem nesta aba."
          actionLabel="Descobrir lojas"
          actionTo="/buscar"
        />
      ) : (
        <ul className="space-y-3 px-5">
          {list.map((order) => (
            <li
              key={order.id}
              className="rounded-3xl bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <img
                  src={order.merchantCover}
                  alt={order.merchantName}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="size-12 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {order.merchantName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{order.code} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold">
                  {formatBRL(order.total)}
                </span>
              </div>

              <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold",
                    order.state === "andamento" && "bg-accent text-accent-foreground",
                    order.state === "concluido" && "bg-success/15 text-success",
                    order.state === "cancelado" &&
                      "bg-secondary text-muted-foreground",
                  )}
                >
                  {order.state === "andamento"
                    ? "Em andamento"
                    : order.state === "concluido"
                      ? "Entregue"
                      : "Cancelado"}
                </span>
                {order.state === "andamento" && (
                  <Link
                    to="/pedidos/$orderId"
                    params={{ orderId: order.id }}
                    className="press inline-flex h-10 items-center rounded-full bg-primary px-4 text-xs font-bold text-primary-foreground"
                  >
                    Acompanhar pedido
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
