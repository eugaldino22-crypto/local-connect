import { createFileRoute, notFound } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone, Star } from "lucide-react";

import { AppShell } from "@/components/vitrine/AppShell";
import { OrderStatus } from "@/components/vitrine/OrderStatus";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { orders } from "@/data/catalog";
import { formatBRL, formatDate } from "@/lib/format";

export const Route = createFileRoute("/pedidos/$orderId")({
  loader: ({ params }) => {
    const order = orders.find((o) => o.id === params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Pedido indisponível — Vitrine Local" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { order } = loaderData;
    return {
      meta: [
        { title: `Pedido #${order.code} — Vitrine Local` },
        {
          name: "description",
          content: `Acompanhe em tempo real o pedido #${order.code} feito em ${order.merchantName}.`,
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { order } = Route.useLoaderData();

  return (
    <AppShell>
      <PageHeader
        title="Acompanhar pedido"
        subtitle={`#${order.code} · ${formatDate(order.createdAt)}`}
        backTo="/pedidos"
      />

      <section className="mx-5 mt-4 rounded-3xl bg-surface p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <img
            src={order.merchantCover}
            alt={order.merchantName}
            width={800}
            height={600}
            className="size-12 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{order.merchantName}</p>
            <p className="text-xs text-muted-foreground">
              {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold">
            {formatBRL(order.total)}
          </span>
        </div>
      </section>

      {/* Espaço reservado para o mapa em tempo real */}
      <div className="mx-5 mt-4 grid h-40 place-items-center rounded-3xl border border-dashed border-border bg-secondary text-center">
        <div>
          <MapPin className="mx-auto size-6 text-primary" />
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Mapa em tempo real disponível em breve
          </p>
        </div>
      </div>

      {order.courier && (
        <section className="mx-5 mt-4 flex items-center gap-3 rounded-3xl bg-surface p-4 shadow-soft">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-lg font-bold text-accent-foreground">
            {order.courier.name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{order.courier.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {order.courier.vehicle}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-warning text-warning" />
              {order.courier.rating.toLocaleString("pt-BR", {
                minimumFractionDigits: 1,
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Ligar para o entregador"
              className="press grid size-10 place-items-center rounded-full bg-secondary"
            >
              <Phone className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Enviar mensagem ao entregador"
              className="press grid size-10 place-items-center rounded-full bg-primary text-primary-foreground"
            >
              <MessageCircle className="size-[18px]" />
            </button>
          </div>
        </section>
      )}

      <div className="mt-6">
        <OrderStatus current={order.status} />
      </div>
    </AppShell>
  );
}
