import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";
import type { CartItemOption, Product } from "@/types";

export function ProductSheet({
  product,
  onOpenChange,
}: {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { addToCart, cartMerchantId } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selection, setSelection] = useState<Record<string, string[]>>({});
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setNote("");
    const initial: Record<string, string[]> = {};
    for (const group of product.optionGroups) {
      const first = group.choices[0];
      initial[group.id] =
        group.type === "single" && group.required && first ? [first.id] : [];
    }
    setSelection(initial);
  }, [product]);

  const options = useMemo<CartItemOption[]>(() => {
    if (!product) return [];
    return product.optionGroups.flatMap((group) =>
      (selection[group.id] ?? []).flatMap((choiceId) => {
        const choice = group.choices.find((c) => c.id === choiceId);
        return choice
          ? [
              {
                groupId: group.id,
                groupName: group.name,
                choiceId: choice.id,
                choiceName: choice.name,
                priceDelta: choice.priceDelta,
              },
            ]
          : [];
      }),
    );
  }, [product, selection]);

  if (!product) return null;

  const unitPrice =
    product.price + options.reduce((sum, o) => sum + o.priceDelta, 0);

  const toggleChoice = (groupId: string, choiceId: string, single: boolean) => {
    setSelection((prev) => {
      const current = prev[groupId] ?? [];
      if (single) return { ...prev, [groupId]: [choiceId] };
      return {
        ...prev,
        [groupId]: current.includes(choiceId)
          ? current.filter((id) => id !== choiceId)
          : [...current, choiceId],
      };
    });
  };

  const handleAdd = () => {
    const replacing =
      cartMerchantId !== null && cartMerchantId !== product.merchantId;
    addToCart({
      productId: product.id,
      merchantId: product.merchantId,
      name: product.name,
      image: product.image,
      unitPrice,
      quantity,
      options,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    toast.success(
      replacing
        ? "Carrinho atualizado com a nova loja"
        : `${product.name} adicionado ao carrinho`,
    );
    onOpenChange(false);
  };

  return (
    <Sheet open onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="mx-auto flex max-h-[92vh] max-w-[460px] flex-col rounded-t-4xl border-border bg-background p-0"
      >
        <div className="overflow-y-auto">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={600}
            className="h-52 w-full rounded-t-4xl object-cover"
          />
          <div className="px-5 pt-4">
            <SheetTitle className="text-xl font-bold">{product.name}</SheetTitle>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {product.description}
            </p>
            <p className="mt-3 text-lg font-bold text-primary">
              {formatBRL(product.price)}
            </p>
          </div>

          {product.optionGroups.map((group) => (
            <div key={group.id} className="mt-5 px-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold">{group.name}</h4>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.required ? "Obrigatório" : "Opcional"}
                </span>
              </div>
              <ul className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface">
                {group.choices.map((choice) => {
                  const active = (selection[group.id] ?? []).includes(choice.id);
                  return (
                    <li key={choice.id}>
                      <button
                        type="button"
                        onClick={() =>
                          toggleChoice(group.id, choice.id, group.type === "single")
                        }
                        aria-pressed={active}
                        className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-b-0"
                      >
                        <span
                          className={cn(
                            "grid size-5 shrink-0 place-items-center border-2 border-border",
                            group.type === "single" ? "rounded-full" : "rounded-md",
                            active && "border-primary bg-primary",
                          )}
                        >
                          {active && (
                            <span className="size-1.5 rounded-full bg-primary-foreground" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium">
                          {choice.name}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                          {choice.priceDelta > 0
                            ? `+ ${formatBRL(choice.priceDelta)}`
                            : "Incluído"}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="mt-5 px-5 pb-4">
            <label
              htmlFor="product-note"
              className="text-sm font-bold"
            >
              Observações
            </label>
            <textarea
              id="product-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Ex.: sem cebola, ponto da carne..."
              className="mt-2 w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-border bg-background px-5 py-4 safe-bottom">
          <div className="flex h-12 items-center gap-3 rounded-full bg-secondary px-3">
            <button
              type="button"
              aria-label="Diminuir quantidade"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="press grid size-8 place-items-center rounded-full bg-surface"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-5 text-center text-sm font-bold">{quantity}</span>
            <button
              type="button"
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((q) => q + 1)}
              className="press grid size-8 place-items-center rounded-full bg-surface"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="press flex h-12 items-center justify-between rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            <span>Adicionar</span>
            <span>{formatBRL(unitPrice * quantity)}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
