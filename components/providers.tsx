"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { GameProvider } from "@/lib/game-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <GameProvider>{children}</GameProvider>
    </AuthProvider>
  );
}
