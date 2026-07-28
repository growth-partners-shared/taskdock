import { ReactNode } from "react";

// LAYOUTS
import { AppNavbar } from "./AppNavbar";

interface Props {
  children: ReactNode;
}

export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
