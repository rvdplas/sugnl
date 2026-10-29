import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";
import AdminTabs from "@/components/AdminTabs";
import BannerEditor from "@/components/BannerEditor";
import { BannerBar } from "@/components/SiteBanner";
import { auth } from "@/auth";
import { featureFlags } from "@/lib/featureFlags";
import { isBannerLive } from "@/lib/bannerInput";
import { getDutchDate } from "@/lib/eventDate";
import { listBanners, type SiteBanner } from "@/lib/siteBanner";
import { removeBannerAction } from "../actions";

export const metadata: Metadata = {
  title: "Banner Admin | SUGNL",
  robots: { index: false, follow: false },
};

// Banner dates are plain calendar days: format them as UTC so no time zone shifts the day.
const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

function formatDay(day: string): string {
  return dateFormat.format(new Date(`${day}T00:00:00Z`));
}

const statusStyles = {
  Live: "bg-(--success-bg) text-(--success-ink)",
  Scheduled: "bg-(--tag-bg) text-(--link)",
  Past: "bg-(--pill-past-bg) text-(--pill-past-ink)",
};

type Status = keyof typeof statusStyles;

// Also the order of the "All" view.
const statuses = Object.keys(statusStyles) as Status[];

function getStatus(banner: SiteBanner, now: Date): Status {
  if (isBannerLive(banner, now)) {
    return "Live";
  }

  return banner.startsOn && banner.startsOn > getDutchDate(now) ? "Scheduled" : "Past";
}

// Live: ending soonest first, open-ended last. Scheduled: starting soonest first. Past: most recently ended first.
function compareWithinStatus(status: Status, a: SiteBanner, b: SiteBanner): number {
  const byDate =
    status === "Live"
      ? (a.endsOn ?? "9999-12-31").localeCompare(b.endsOn ?? "9999-12-31")
      : status === "Scheduled"
        ? (a.startsOn ?? "").localeCompare(b.startsOn ?? "")
        : (b.endsOn ?? "").localeCompare(a.endsOn ?? "");

  return byDate || b.id - a.id;
}

function describeSchedule(banner: SiteBanner): string {
  const start = banner.startsOn ? `From ${formatDay(banner.startsOn)}` : "From publication";
  const end = banner.endsOn ? `through ${formatDay(banner.endsOn)}` : "until removed";
  return `${start} ${end}`;
}

interface BannerAdminPageProps {
  readonly searchParams: Promise<{ status?: string }>;
}

export default async function BannerAdminPage({ searchParams }: BannerAdminPageProps) {
  if (!featureFlags.newsletter) {
    notFound();
  }

  const session = await auth();
  if (!session?.isAdmin) {
    redirect("/admin");
  }

  const [allBanners, { status: statusParam }] = await Promise.all([listBanners(), searchParams]);
  const now = new Date();
  const filter = statuses.find((status) => status.toLowerCase() === statusParam);

  const withStatus = allBanners
    .map((banner) => ({ banner, status: getStatus(banner, now) }))
    .sort(
      (a, b) =>
        statuses.indexOf(a.status) - statuses.indexOf(b.status) || compareWithinStatus(a.status, a.banner, b.banner),
    );
  const banners = filter ? withStatus.filter((item) => item.status === filter) : withStatus;
  const count = (status?: Status) => (status ? withStatus.filter((item) => item.status === status).length : withStatus.length);

  return (
    <PageContainer className="md:py-16">
      <AdminTabs userName={session.user?.name} />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <PageIntro
          title="Site banners"
          description="Announcements at the top of every page. Visitors can close each banner; a new banner shows to everyone."
          sectionClassName=""
        />
        <BannerEditor />
      </div>

      <nav aria-label="Filter banners" className="mb-6 flex flex-wrap gap-2">
        {[undefined, ...statuses].map((status) => {
          const isActive = status === filter;

          return (
            <Link
              key={status ?? "All"}
              href={status ? `/admin/banner?status=${status.toLowerCase()}` : "/admin/banner"}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-(--button-primary) bg-(--button-primary) text-white"
                  : "border-(--line) text-(--muted) hover:text-(--ink)"
              }`}
            >
              {status ?? "All"} <span className="opacity-70">{count(status)}</span>
            </Link>
          );
        })}
      </nav>

      {banners.length === 0 ? (
        <p className="surface-card bg-(--surface-soft) p-6 text-(--muted) md:p-8">
          {filter ? `No ${filter.toLowerCase()} banners.` : "No banners yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {banners.map(({ banner, status }) => {
            return (
              <li key={banner.id} className="surface-card space-y-3 bg-(--surface-soft) p-5 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className={`rounded-full px-3 py-1 font-medium ${statusStyles[status]}`}>{status}</span>
                    <span className="text-(--muted)">{describeSchedule(banner)}</span>
                    {!banner.dismissible && <span className="text-(--muted)">· Can&apos;t be closed</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <BannerEditor banner={banner} />
                    <form action={removeBannerAction}>
                      <input type="hidden" name="id" value={banner.id} />
                      <button
                        type="submit"
                        aria-label={`Remove banner: ${banner.message}`}
                        className="text-sm text-(--error-ink) underline-offset-4 hover:underline"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
                <div inert className={`overflow-hidden rounded-lg ${status === "Past" ? "opacity-60" : ""}`}>
                  <BannerBar banner={banner} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}
