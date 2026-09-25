"use client";

import { usePathname } from "next/navigation";

import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isWatchPage = pathname === "/watch";

  if (isWatchPage) {
    return <>{children}</>;
  }

  return (
    <main className="app-shell">
      <Sidebar />

      <div className="main-column">
        <Topbar />

        {children}

        <Footer />
      </div>
    </main>
  );
}
