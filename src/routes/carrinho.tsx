import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { AppShell } from "@/components/vitrine/AppShell";
import { EmptyState } from "@/components/vitrine/EmptyState";
import { PageHeader } from "@/components/vitrine/PageHeader";
import { getMerchantById } from "@/data/catalog";
import { formatBRL, formatFee } from "@/lib/format";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Seu carrinho — Vitrine Local" },
      {
        name: "description",
        content:
          "Revise os itens do seu pedido, adicionais e taxa de entrega antes de finalizar no Vitrine Local.",
      },
      { property: "og:title", content: "Seu carrinho — Vitrine Local" },
      {
        property: "og:description",
        content: "Confira itens, adicionais e total do seu pedido local.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartSubtotal, updateQuantity, removeFromCart, clearCart } =
    useApp();
  const merchant = cart[0] ? getMerchantById(cart[0].merchantId) : undefined;
  const deliveryFee = merchant?.deliveryFee ?? 0;
  const total = cartSubtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <AppShell>
        <PageHeader title="Carrinho" />
        <EmptyState
          icon={ShoppingBag}
          title="Seu carrinho está vazio"
          description="Explore os estabelecimentos perto de você e adicione seus itens favoritos."
          actionLabel="Explorar lojas"
          actionTo="/buscar"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Carrinho"
        subtitle={merchant?.name}
        action={
          <button
            type="button"
            onClick={clearCart}
            aria-label="Esvaziar carrinho"
            className="press grid size-10 place-items-center rounded-full bg-secondary text-muted-foreground"
          >
            <Trash2 className="size-[18px]" />
          </button>
        }
      />

      {merchant && (
        <Link
          to="/loja/$slug"
          params={{ slug: merchant.slug }}
          className="press mx-5 mt-4 flex items-center gap-3 rounded-3xl bg-surface p-3 shadow-soft"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-accent text-xl">
            {merchant.logoEmoji}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">
              {merchant.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {merchant.etaMin}–{merchant.etaMax} min ·{" "}
              {formatFee(merchant.deliveryFee)}
            </span>
          </span>
        </Link>
      )}

      <ul className="mt-4 space-y-3 px-5">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-3xl bg-surface p-3 shadow-soft"
          >
            <img
              src={item.image}
              alt={item.name}
              width={800}
              height={600}
              loading="lazy"
              className="size-16 shrink-0 rounded-2xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{item.name}</p>
              {item.options.length > 0 && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                  {item.options.map((o) => o.choiceName).join(", ")}
                </p>
              )}
              {item.note && (
                <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                  “{item.note}”
                </p>
              )}
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-primary">
                  {formatBRL(item.unitPrice * item.quantity)}
                </span>
                <span className="flex items-center gap-2 rounded-full bg-secondary px-2 py-1">
                  <button
                    type="button"
                    aria-label={`Diminuir ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="press grid size-7 place-items-center rounded-full bg-surface"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-4 text-center text-xs font-bold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Aumentar ${item.name}`}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="press grid size-7 place-items-center rounded-full bg-surface"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remover ${item.name}`}
              onClick={() => removeFromCart(item.id)}
              className="press h-fit rounded-full p-1 text-muted-foreground"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <section className="mx-5 mt-5 rounded-3xl bg-surface p-4 shadow-soft">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-foreground">
              {formatBRL(cartSubtotal)}
            </dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Taxa de entrega</dt>
            <dd className="font-semibold text-foreground">
              {formatFee(deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatBRL(total)}</dd>
          </div>
        </dl>
      </section>

      <div className="px-5 pt-5">
        <Link
          to="/checkout"
          className="press flex h-14 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-glow"
        >
          Continuar pedido
        </Link>
      </div>
    </AppShell>
  );
}
