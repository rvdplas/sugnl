"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { SiteBanner as SiteBannerData } from "@/lib/siteBanner";
import { isBannerLive, parseBannerMessage } from "@/lib/bannerInput";

const STORAGE_KEY = "dismissed-banners";

function getDismissedIds(): number[] | null {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  } catch {
    // Storage blocked (e.g. strict privacy mode): null hides every closable banner rather than nag on every page.
    return null;
  }
}

interface SiteBannerProps {
  readonly banners: SiteBannerData[];
}

export default function SiteBanner({ banners }: SiteBannerProps) {
  const pathname = usePathname();
  // Empty until mounted so returning visitors never see a flash of a closed banner.
  const [shownIds, setShownIds] = useState<number[]>([]);

  useEffect(() => {
    const dismissed = getDismissedIds();
    const isClosed = (id: number) => dismissed === null || dismissed.includes(id);
    setShownIds(
      banners
        .filter((banner) => isBannerLive(banner) && (!banner.dismissible || !isClosed(banner.id)))
        .map((banner) => banner.id),
    );
  }, [banners]);

  // A banner pointing to the current page has done its job there.
  const linksHere = (message: string) => parseBannerMessage(message).some((segment) => segment.href === pathname);
  const shown = banners.filter((banner) => shownIds.includes(banner.id) && !linksHere(banner.message));
  if (shown.length === 0) {
    return null;
  }

  const dismiss = (id: number) => {
    try {
      // Keep only ids that still exist, so the list never grows past the current banners.
      const dismissed = (getDismissedIds() ?? []).filter((dismissedId) => banners.some((banner) => banner.id === dismissedId));
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, id]));
    } catch {}
    setShownIds((ids) => ids.filter((shownId) => shownId !== id));
  };

  return (
    <div className="divide-y divide-white/20">
      {shown.map((banner) => (
        <BannerBar key={banner.id} banner={banner} onDismiss={banner.dismissible ? () => dismiss(banner.id) : undefined} />
      ))}
    </div>
  );
}

interface BannerBarProps {
  readonly banner: Pick<SiteBannerData, "message" | "dismissible">;
  readonly onDismiss?: () => void;
}

/** The banner's look, shared by the live banner and the admin preview. */
export function BannerBar({ banner, onDismiss }: BannerBarProps) {
  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-[#5b3df5] to-[#1f6fe0] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-sm">
        <p>
          {parseBannerMessage(banner.message).map((segment, index) =>
            segment.href ? (
              <Link
                key={index}
                href={segment.href}
                onClick={onDismiss}
                className="font-semibold underline underline-offset-4 hover:opacity-80"
              >
                {segment.text}
              </Link>
            ) : (
              segment.text
            ),
          )}
        </p>
        {banner.dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss announcement"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
}
