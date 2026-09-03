import { Link, type LinkProps } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, ReceiptText, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";

const items = [
  { to: "/", label: "Início", icon: Home, exact: true },
  { to: "/buscar", label: "Buscar", icon: Search, exact: false },
  { to: "/pedidos", label: "Pedidos", icon: ReceiptText, exact: false },
  { to: "/perfil", label: "Perfil", icon: User, exact: false },
] as const;

export function BottomNavigation() {
  const { cartCount } = useApp();

  return (
    <nav
      aria-label="Navegação principal"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center"
    >
      <div className="pointer-events-auto relative w-full max-w-[460px] safe-bottom border-t border-border bg-surface/95 pt-2 shadow-nav backdrop-blur">
        <ul className="grid grid-cols-5 items-end px-2">
          {items.slice(0, 2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <li className="flex justify-center">
            <Link
              to="/carrinho"
              aria-label={`Carrinho${cartCount ? `, ${cartCount} itens` : ", vazio"}`}
              className="press relative -mt-9 grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow ring-4 ring-background"
            >
              <ShoppingBag className="size-6" strokeWidth={2.2} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-6 place-items-center rounded-full bg-foreground px-1.5 py-0.5 text-[11px] font-bold text-background">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>

          {items.slice(2).map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  exact,
}: {
  to: NonNullable<LinkProps["to"]>;
  label: string;
  icon: typeof Home;
  exact: boolean;
}) {
  return (
    <li>
      <Link
        to={to}
        activeOptions={{ exact }}
        className="press group flex flex-col items-center gap-1 py-2 text-muted-foreground data-[status=active]:text-primary"
      >
        <Icon className="size-5" strokeWidth={2.1} />
        <span className="text-[11px] font-semibold">{label}</span>
        <span
          className={cn(
            "h-1 w-1 rounded-full bg-transparent",
            "group-data-[status=active]:bg-primary",
          )}
        />
      </Link>
    </li>
  );
}
