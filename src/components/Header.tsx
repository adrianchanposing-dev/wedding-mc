import Link from "next/link";
import { site } from "@/lib/site";

const navItems = [
  { href: "/#about", label: "關於我" },
  { href: "/#portfolio", label: "過往案例" },
  { href: "/prep", label: "籌備資訊" },
  { href: "/rundown", label: "婚禮流程表製作" },
  { href: "/#contact", label: "聯絡我" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif-display text-xl tracking-wide text-ink">
          {site.brand}
        </Link>
        <nav className="hidden gap-6 text-sm text-muted md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-accent-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#contact"
          className="rounded-full bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-accent-dark"
        >
          查詢檔期
        </Link>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-line px-6 py-2 text-xs text-muted md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
