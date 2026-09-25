import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
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
