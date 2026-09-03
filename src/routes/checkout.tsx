import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Banknote, CreditCard, MapPin, QrCode, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/vitrine/AppShell";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { getMerchantById, paymentMethods, savedAddresses } from "@/data/catalog";
import { formatBRL, formatFee } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";
import type { PaymentMethodKind } from "@/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Finalizar pedido — Vitrine Local" },
      {
        name: "description",
        content:
          "Confirme endereço, forma de entrega e pagamento (Pix, cartão ou dinheiro) para finalizar seu pedido.",
      },
      { property: "og:title", content: "Finalizar pedido — Vitrine Local" },
      {
        property: "og:description",
        content: "Endereço, entrega e pagamento em poucos toques.",
      },
    ],
  }),
  component: CheckoutPage,
});

const icons: Record<PaymentMethodKind, typeof QrCode> = {
  pix: QrCode,
  card: CreditCard,
  cash: Banknote,
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, clearCart, city } = useApp();
  const saved = savedAddresses[0];

  const [street, setStreet] = useState(saved?.street ?? "");
  const [number, setNumber] = useState(saved?.number ?? "");
  const [complement, setComplement] = useState(saved?.complement ?? "");
  const [reference, setReference] = useState(saved?.reference ?? "");
  const [payment, setPayment] = useState<string>("pix");

  const merchant = cart[0] ? getMerchantById(cart[0].merchantId) : undefined;
  const deliveryFee = merchant?.deliveryFee ?? 0;
  const total = cartSubtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Checkout" backTo="/carrinho" />
        <EmptyState
          icon={ShoppingBag}
          title="Nenhum item para finalizar"
          description="Adicione produtos ao carrinho para concluir um pedido."
          actionLabel="Explorar lojas"
          actionTo="/buscar"
        />
      </AppShell>
    );
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!street.trim() || !number.trim()) {
      toast.error("Informe rua e número para a entrega.");
      return;
    }
    clearCart();
    toast.success("Pedido enviado para a loja!");
    navigate({ to: "/pedidos/$orderId", params: { orderId: "o1" } });
  };

  return (
    <AppShell>
      <PageHeader
        title="Finalizar pedido"
        subtitle={merchant?.name ?? "Revise os dados"}
        backTo="/carrinho"
      />

      <form onSubmit={handleSubmit} className="px-5 pt-4">
        <fieldset className="rounded-3xl bg-surface p-4 shadow-soft">
          <legend className="flex items-center gap-2 text-sm font-bold">
            <MapPin className="size-4 text-primary" /> Endereço de entrega
          </legend>
          <p className="mt-1 text-xs text-muted-foreground">
            {city ? `${city.name} · ${city.state}` : "Selecione sua cidade na Home"}
          </p>
          <div className="mt-3 space-y-2.5">
            <Field label="Rua" value={street} onChange={setStreet} required />
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Número" value={number} onChange={setNumber} required />
              <Field
                label="Complemento"
                value={complement}
                onChange={setComplement}
              />
            </div>
            <Field
              label="Ponto de referência"
              value={reference}
              onChange={setReference}
            />
          </div>
        </fieldset>

        <fieldset className="mt-4 rounded-3xl bg-surface p-4 shadow-soft">
          <legend className="text-sm font-bold">Entrega</legend>
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-primary bg-accent px-4 py-3">
            <div>
              <p className="text-sm font-bold">Entrega padrão</p>
              <p className="text-xs text-muted-foreground">
                {merchant ? `${merchant.etaMin}–${merchant.etaMax} min` : "—"}
              </p>
            </div>
            <span className="text-sm font-bold">{formatFee(deliveryFee)}</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Retirada na loja e entrega agendada chegam em breve.
          </p>
        </fieldset>

        <fieldset className="mt-4 rounded-3xl bg-surface p-4 shadow-soft">
          <legend className="text-sm font-bold">Pagamento</legend>
          <ul className="mt-2 space-y-2">
            {paymentMethods.map((method) => {
              const Icon = icons[method.kind];
              const active = payment === method.id;
              return (
                <li key={method.id}>
                  <button
                    type="button"
                    onClick={() => setPayment(method.id)}
                    aria-pressed={active}
                    className={cn(
                      "press flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-left",
                      active && "border-primary bg-accent",
                    )}
                  >
                    <Icon className="size-5 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        {method.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {method.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <section className="mt-4 rounded-3xl bg-surface p-4 shadow-soft">
          <h2 className="text-sm font-bold">Resumo do pedido</h2>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="min-w-0 truncate">
                  {item.quantity}× {item.name}
                </span>
                <span className="shrink-0 font-semibold text-foreground">
                  {formatBRL(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-foreground">
                {formatBRL(cartSubtotal)}
              </dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Entrega</dt>
              <dd className="font-semibold text-foreground">
                {formatFee(deliveryFee)}
              </dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>{formatBRL(total)}</dd>
            </div>
          </dl>
        </section>

        <button
          type="submit"
          className="press mt-5 flex h-14 w-full items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow"
        >
          Finalizar pedido · {formatBRL(total)}
        </button>
      </form>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="mt-1 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
