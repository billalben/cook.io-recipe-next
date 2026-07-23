"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, UtensilsCrossed, Search, Bookmark } from "lucide-react";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
];

const mobileLinks = [
  { href: "/recipes", label: "Recipes", icon: Search },
  { href: "/", label: "Home", icon: UtensilsCrossed },
  { href: "/saved", label: "Saved", icon: Bookmark },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[var(--color-surface)] border-b border-[var(--color-outline)] h-[var(--header-height)] hidden md:flex items-center">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-primary" />
            <span className="font-display text-xl text-[var(--color-on-surface)]">
              Cook.io
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary text-on-primary"
                    : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-outline-variant)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/saved"
              className={`ml-2 px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-1.5 border ${
                pathname === "/saved"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-[var(--color-outline)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-outline-variant)]"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Recipes
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--color-outline-variant)] transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-[var(--color-on-surface)]" />
            ) : (
              <Moon className="w-5 h-5 text-[var(--color-on-surface)]" />
            )}
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-outline)] h-[var(--mobile-nav-height)]">
        <div className="grid grid-cols-3 h-full">
          {mobileLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-[var(--color-on-surface-variant)]"
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
