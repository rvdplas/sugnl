"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/become-a-speaker", label: "Become a speaker" },
  { href: "/past-events", label: "Past events" },
  { href: "/community-blogs", label: "Community blogs" },
  { href: "/organizers", label: "About us" },
];

export default function SiteHeader() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const menu = mobileMenuRef.current;

      if (!menu || !menu.hasAttribute("open")) {
        return;
      }

      const target = event.target;

      if (target instanceof Node && !menu.contains(target)) {
        menu.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, []);

  return (
    <nav className="border-b border-[color:var(--nav-line)] bg-[color:var(--nav-bg)] text-[color:var(--nav-text)]">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 flex-shrink items-center">
            <Image
              src="/sugnl-logo.png"
              alt="SUGNL Logo"
              width={200}
              height={32}
              priority
              className="h-8 w-auto max-w-[200px] object-contain sm:max-w-xs md:max-w-none"
            />
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <div className="flex items-center gap-6 text-sm font-medium text-[color:var(--nav-text-muted)]">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <details ref={mobileMenuRef} className="group relative">
              <summary
                className="inline-flex h-9 w-9 list-none items-center justify-center rounded-full border border-[color:var(--nav-line)] text-[color:var(--nav-text)] transition-opacity hover:opacity-80 [&::-webkit-details-marker]:hidden"
                aria-label="Toggle navigation menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 group-open:hidden"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 24 24"
                  className="hidden h-5 w-5 group-open:block"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>

              <div className="absolute right-0 z-20 mt-3 w-[min(84vw,320px)] rounded-2xl border border-[color:var(--nav-line)] bg-[color:var(--hero-1)] p-2 shadow-lg">
                <div className="flex flex-col">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-[color:var(--nav-text-muted)] transition-colors hover:bg-white/10 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </nav>
  );
}
