import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";

import { AppShell } from "@/components/vitrine/AppShell";

export const Route = createFileRoute("/notificacoes")({
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <AppShell>
      <header className="flex items-center gap-3 px-5 pt-5">
        <Link
          to="/"
          aria-label="Voltar"
          className="press grid size-10 place-items-center rounded-2xl bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div>
          <h1 className="text-xl font-extrabold">Notificações</h1>
          <p className="text-sm text-muted-foreground">
            Pedidos, ofertas e novidades
          </p>
        </div>
      </header>

      <section className="px-5 pt-12">
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="grid size-16 place-items-center rounded-3xl bg-accent text-accent-foreground">
            <Bell className="size-7" />
          </div>

          <h2 className="mt-5 text-lg font-bold">
            Você está em dia
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Quando houver novidades sobre seus pedidos, ofertas ou sua conta,
            elas aparecerão aqui.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
