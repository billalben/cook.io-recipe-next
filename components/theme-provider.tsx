"use client";

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = sessionStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("themechange", onChange);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("themechange", onChange);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const theme = useSyncExternalStore(subscribe, getInitialTheme, getServerSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === "light" ? "dark" : "light";
    sessionStorage.setItem("theme", next);
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
