import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-8 text-center text-sm text-muted">
        <p className="font-serif-display text-base text-ink">{site.brand}</p>
        <p>{site.tagline}｜{site.taglineSub}</p>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
