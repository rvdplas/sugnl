"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { featureFlags } from "@/lib/featureFlags";

const navigationItems = [
  { href: "/", label: "Home", mobileOnly: true },
  { href: "/events", label: "Events", priority: "primary" },
  ...(featureFlags.newsletter
    ? [{ href: "/newsletter", label: "Newsletter", priority: "primary" }]
    : []),
  { href: "/become-a-speaker", label: "Become a speaker", priority: "primary" },
  { href: "/dutch-mvps", label: "Dutch MVPs", priority: "primary" },
  { href: "/community-blogs", label: "Community blogs", priority: "secondary" },
  { href: "/organizers", label: "About us", priority: "secondary" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);
  const desktopMoreMenuRef = useRef<HTMLDetailsElement>(null);

  const primaryDesktopItems = navigationItems.filter((item) => item.priority === "primary");
  const secondaryDesktopItems = navigationItems.filter((item) => item.priority === "secondary");

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute("open");
  };

  const closeDesktopMoreMenu = () => {
    desktopMoreMenuRef.current?.removeAttribute("open");
  };

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;

    return `rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
      isActive
        ? "bg-white/12 text-white"
        : "text-[color:var(--nav-text-muted)] hover:bg-white/8 hover:text-white"
    }`;
  };

  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      const menus = [mobileMenuRef.current, desktopMoreMenuRef.current];
      const target = event.target;

      menus.forEach((menu) => {
        if (!menu || !menu.hasAttribute("open")) {
          return;
        }

        if (target instanceof Node && !menu.contains(target)) {
          menu.removeAttribute("open");
        }
      });
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        mobileMenuRef.current?.removeAttribute("open");
        desktopMoreMenuRef.current?.removeAttribute("open");
      }
    };

    document.addEventListener("mousedown", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <nav className="border-b border-[color:var(--nav-line)] bg-[color:var(--nav-bg)] text-[color:var(--nav-text)]">
      <div className="mx-auto max-w-7xl px-4 py-4">
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

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-[color:var(--nav-line)] bg-white/[0.03] p-1">
              {primaryDesktopItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getLinkClasses(item.href)}
                >
                  {item.label}
                </Link>
              ))}

              {secondaryDesktopItems.length > 0 && (
                <details ref={desktopMoreMenuRef} className="group relative">
                  <summary
                    className="inline-flex list-none items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--nav-text-muted)] transition-colors hover:bg-white/8 hover:text-white [&::-webkit-details-marker]:hidden"
                    aria-label="Open more navigation links"
                  >
                    More
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>

                  <div className="absolute right-0 z-20 mt-2 min-w-52 rounded-2xl border border-[color:var(--nav-line)] bg-[color:var(--hero-1)] p-2 shadow-lg">
                    <div className="flex flex-col">
                      {secondaryDesktopItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeDesktopMoreMenu}
                          className={getLinkClasses(item.href)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </details>
              )}
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
                      className={getLinkClasses(item.href)}
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
