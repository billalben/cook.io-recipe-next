"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, UtensilsCrossed, Search, Bookmark } from "lucide-react";

const desktopLinks = [
  { href: "/", label: "Home", match: ["/"] },
  { href: "/recipes", label: "Recipes", match: ["/recipes", "/detail"] },
];

const mobileLinks = [
  { href: "/recipes", label: "Recipes", icon: Search, match: ["/recipes", "/detail"] },
  { href: "/", label: "Home", icon: UtensilsCrossed, match: ["/"] },
  { href: "/saved", label: "Saved", icon: Bookmark, match: ["/saved"] },
];

function isActive(pathname: string, match: string[]): boolean {
  return match.some((base) =>
    base === "/"
      ? pathname === "/"
      : pathname === base || pathname.startsWith(`${base}/`)
  );
}

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-surface border-b border-outline h-[var(--header-height)] hidden md:flex items-center">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-primary" />
            <span className="font-display text-xl text-on-surface">
              Cook.io
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive(pathname, link.match)
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-outline-variant"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/saved"
            className={`ml-2 px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5 border ${
              isActive(pathname, ["/saved"])
                ? "bg-primary text-on-primary border-primary"
                : "border-outline text-on-surface-variant hover:bg-outline-variant"
            }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Recipes
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-outline-variant transition-colors"
            aria-label={
              theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-on-surface" />
            ) : (
              <Moon className="w-5 h-5 text-on-surface" />
            )}
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface border-t border-outline h-[var(--mobile-nav-height)]">
        <div className="grid grid-cols-3 h-full">
          {mobileLinks.map((link) => {
            const active = isActive(pathname, link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-on-surface-variant"
                }`}
              >
                <link.icon className="w-6 h-6" />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
