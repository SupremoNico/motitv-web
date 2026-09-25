"use client";

import { Bookmark, Home, Search, Tv, Clapperboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryNavigation = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Movies",
    href: "/movies",
    icon: Clapperboard,
  },
  {
    label: "Series",
    href: "/series",
    icon: Tv,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
];

const secondaryNavigation = [
  {
    label: "My List",
    href: "/my-list",
    icon: Bookmark,
  },
];

type SidebarProps = {
  mobileMenu?: boolean;
  setMobileMenu?: (open: boolean) => void;
};

export function Sidebar({ mobileMenu = false, setMobileMenu }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavigation = () => {
    setMobileMenu?.(false);
  };

  return (
    <>
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <Link href="/" className="sidebar-brand" onClick={handleNavigation}>
          <img className="wordmark" src="/images/logo.png" alt="MotiTV" />
        </Link>

        <nav aria-label="Main navigation">
          <span className="nav-section-label">Browse</span>

          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : ""}
                onClick={handleNavigation}
              >
                <Icon size={21} />
                {item.label}
              </Link>
            );
          })}

          <div className="nav-divider" />

          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : ""}
                onClick={handleNavigation}
              >
                <Icon size={21} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {mobileMenu && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setMobileMenu?.(false)}
          aria-label="Close navigation"
        />
      )}
    </>
  );
}
