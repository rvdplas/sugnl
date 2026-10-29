"use client";

import { useSyncExternalStore } from "react";

type ThemeToggleProps = {
  className?: string;
  showLabel?: boolean;
};

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "themechange";
const darkSchemeQuery = "(prefers-color-scheme: dark)";

// data-theme holds an explicit choice (set before paint by the script in app/layout.tsx); otherwise the system theme applies.
function getTheme(): Theme {
  const chosen = document.documentElement.getAttribute("data-theme");
  if (chosen === "light" || chosen === "dark") {
    return chosen;
  }

  return window.matchMedia(darkSchemeQuery).matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(darkSchemeQuery);
  media.addEventListener("change", onChange);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  // null on the server and during hydration, so the first client render matches the server HTML.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const mounted = theme !== null;

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Storage blocked: the choice still applies until the page reloads.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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
