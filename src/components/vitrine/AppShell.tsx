import type { ReactNode } from "react";

import { BottomNavigation } from "./BottomNavigation";

/**
 * Coluna central com largura de app nativo. No desktop o conteúdo permanece
 * confortável em vez de esticar por toda a tela.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="mx-auto min-h-screen w-full max-w-[460px] bg-background pb-28 shadow-soft">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
