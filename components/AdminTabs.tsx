"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAdmin } from "@/app/admin/actions";

const tabs = [
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/banner", label: "Site banners" },
];

interface AdminTabsProps {
  readonly userName: string | null | undefined;
}

export default function AdminTabs({ userName }: AdminTabsProps) {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-(--line)">
      <nav aria-label="Admin sections" className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-(--button-primary) text-(--ink)"
                  : "border-transparent text-(--muted) hover:text-(--ink)"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <form action={signOutAdmin} className="flex items-center gap-3 pb-2 text-sm text-(--muted)">
        <span>Signed in as {userName}</span>
        <button type="submit" className="underline underline-offset-4">
          Sign out
        </button>
      </form>
    </div>
  );
}
