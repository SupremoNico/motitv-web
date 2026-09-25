import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "MotiTV — Find your next favorite",
  description:
    "A premium streaming home for movies, shows, and stories worth watching.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}