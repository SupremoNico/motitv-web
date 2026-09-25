"use client";

import { Bell, Menu, Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function TopbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSearch = (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <header className="topbar">
      <button
        className="mobile-menu-button"
        aria-label="Open navigation"
        type="button"
      >
        <Menu size={22} />
      </button>

      <div className="search-field">
        <Search size={20} />

        <input
          type="search"
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search movies, shows, or people..."
          aria-label="Search movies, shows, or people"
        />
      </div>

      <div className="top-actions">
        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={21} />
        </button>

        <button
          className="avatar"
          type="button"
          aria-label="Open account menu"
          onClick={() => router.push("/signin")}
        >
          <Image src="/images/avatar.png" alt="" width={40} height={40} />
        </button>
      </div>
    </header>
  );
}

export function Topbar() {
  return (
    <Suspense fallback={null}>
      <TopbarContent />
    </Suspense>
  );
}
