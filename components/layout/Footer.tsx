import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <span>© 2026 MOTITV</span>

      <div>
        <Link href="/about">About</Link>
        <Link href="/help">Help center</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
