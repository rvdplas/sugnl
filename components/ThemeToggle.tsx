"use client";

import { useEffect, useState } from "react";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = getStoredTheme() ?? getSystemTheme();
    document.documentElement.setAttribute("data-theme", initialTheme);
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${
        showLabel
          ? "inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-[color:var(--nav-line)] px-4 py-3 text-sm font-medium"
          : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--nav-line)]"
      } text-[color:var(--nav-text)] transition-opacity hover:opacity-80 ${className}`.trim()}
      aria-label={mounted ? `Switch to ${theme === "light" ? "dark" : "light"} theme` : "Toggle theme"}
      title={mounted ? `Switch to ${theme === "light" ? "dark" : "light"} theme` : "Toggle theme"}
      suppressHydrationWarning
    >
      <span className="flex items-center gap-3">
        {/* Keep moon icon visible until mounted so SSR and client initial render match */}
        {mounted && theme !== "light" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {showLabel && <span>Theme</span>}
      </span>
      {showLabel && mounted && (
        <span className="text-[color:var(--nav-text-muted)]">
          {theme === "light" ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
