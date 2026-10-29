import { unstable_cache } from "next/cache";
import { getSql } from "@/lib/db";
import type { BannerInput } from "@/lib/bannerInput";

export const SITE_BANNER_TAG = "site-banner";

export interface SiteBanner extends BannerInput {
  id: number;
}

function toBanner(row: Record<string, unknown>): SiteBanner {
  return {
    id: Number(row.id),
    message: String(row.message),
    startsOn: (row.starts_on as string | null) ?? null,
    endsOn: (row.ends_on as string | null) ?? null,
    dismissible: Boolean(row.dismissible),
  };
}

// Includes scheduled banners: the browser decides what is live, so a new day takes effect
// at midnight instead of waiting for this cache or the static pages to refresh.
const loadUpcomingBanners = unstable_cache(
  async (): Promise<SiteBanner[]> => {
    const rows = await getSql()`
      SELECT id, message, starts_on::text, ends_on::text, dismissible FROM site_banners
      WHERE active AND (ends_on IS NULL OR ends_on >= (NOW() AT TIME ZONE 'Europe/Amsterdam')::date)
      ORDER BY id
    `;

    return rows.map(toBanner);
  },
  [SITE_BANNER_TAG],
  { tags: [SITE_BANNER_TAG], revalidate: 3600 },
);

/** Banners that show now or later. Never throws: a database outage must not take the whole site down. */
export async function getUpcomingBanners(): Promise<SiteBanner[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await loadUpcomingBanners();
  } catch (error) {
    console.error("Loading the site banners failed.", error);
    return [];
  }
}

/** Every banner an Admin has not removed, also the ones that ended, newest first. */
export async function listBanners(): Promise<SiteBanner[]> {
  const rows = await getSql()`
    SELECT id, message, starts_on::text, ends_on::text, dismissible FROM site_banners
    WHERE active ORDER BY id DESC
  `;

  return rows.map(toBanner);
}

export async function createBanner(banner: BannerInput): Promise<void> {
  await getSql()`
    INSERT INTO site_banners (message, starts_on, ends_on, dismissible)
    VALUES (${banner.message}, ${banner.startsOn}, ${banner.endsOn}, ${banner.dismissible})
  `;
}

export async function updateBanner(id: number, banner: BannerInput): Promise<void> {
  await getSql()`
    UPDATE site_banners
    SET message = ${banner.message}, starts_on = ${banner.startsOn}, ends_on = ${banner.endsOn},
        dismissible = ${banner.dismissible}
    WHERE id = ${id} AND active
  `;
}

export async function removeBanner(id: number): Promise<void> {
  await getSql()`UPDATE site_banners SET active = FALSE WHERE id = ${id}`;
}
