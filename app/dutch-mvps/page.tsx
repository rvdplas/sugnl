import Link from "next/link";
import { getDutchMvpDirectoryUrl, getDutchMvpsForYear } from "@/lib/sitecoreMvps";
import PageIntro from "@/components/PageIntro";
import PageContainer from "@/components/PageContainer";

interface PageProps {
  readonly searchParams: Promise<{
    year?: string;
  }>;
}

function resolveYear(rawYear: string | undefined): number {
  const currentYear = new Date().getFullYear();

  if (!rawYear) {
    return currentYear;
  }

  const parsedYear = Number.parseInt(rawYear, 10);

  if (!Number.isFinite(parsedYear)) {
    return currentYear;
  }

  return Math.max(2010, Math.min(currentYear, parsedYear));
}

export default async function DutchMvpsPage({ searchParams }: PageProps) {
  const { year: rawYear } = await searchParams;
  const year = resolveYear(rawYear);
  const currentYear = new Date().getFullYear();
  const sourceUrl = getDutchMvpDirectoryUrl(year);

  let mvps = [] as Awaited<ReturnType<typeof getDutchMvpsForYear>>;
  let loadError = false;

  try {
    mvps = await getDutchMvpsForYear(year);
  } catch {
    loadError = true;
  }

  const availableYears = Array.from(
    { length: currentYear - 2010 + 1 },
    (_, index) => currentYear - index,
  );
  const recentYears = availableYears.slice(0, 5);

  const renderYearLink = (availableYear: number) => (
    <Link
      key={availableYear}
      href={`/dutch-mvps?year=${availableYear}`}
      className={`pill border border-[color:var(--line)] ${
        availableYear === year
          ? "bg-[color:var(--pill-upcoming-bg)] text-[color:var(--accent-ink)]"
          : "bg-[color:var(--surface)] text-[color:var(--ink)]"
      }`}
    >
      {availableYear}
    </Link>
  );

  return (
    <PageContainer>
      <PageIntro
        title="Dutch Sitecore MVPs"
        description={`Celebrating the Sitecore MVPs from the Netherlands for ${year}. This list is fetched from the official Sitecore MVP directory.`}
        sectionClassName="mb-8"
      />

      <section className="surface-card mb-8 p-5 md:p-6">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">
              Year filter
            </p>
            <p className="mt-1 text-sm text-[color:var(--ink)]">
              Showing Netherlands MVPs for <span className="font-bold">{year}</span>
            </p>
          </div>

          <div className="-mx-1 overflow-x-auto pb-1">
            <div className="inline-flex min-w-full items-center gap-2 px-1 sm:min-w-0">
              {recentYears.map(renderYearLink)}
            </div>
          </div>

          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[color:var(--link)] hover:underline"
          >
            View source on mvp.sitecore.com →
          </a>
        </div>
      </section>

      {loadError ? (
        <p className="surface-card p-6 text-center text-[color:var(--muted)]">
          Unable to load the MVP list right now. Please try again later or use the source link above.
        </p>
      ) : mvps.length === 0 ? (
        <p className="surface-card p-6 text-center text-[color:var(--muted)]">
          No Dutch MVPs were found for {year}.
        </p>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mvps.map((mvp) => (
            <a
              key={mvp.profileUrl}
              href={mvp.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card block p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <img
                src={mvp.photoUrl}
                alt={mvp.name}
                loading="lazy"
                decoding="async"
                className="mb-4 h-24 w-24 rounded-full object-cover"
              />
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">
                {mvp.type}
              </p>
              <h2 className="text-xl font-bold text-[color:var(--ink)]">{mvp.name}</h2>
              <p className="mt-3 text-sm text-[color:var(--link)]">Open profile →</p>
            </a>
          ))}
        </section>
      )}
    </PageContainer>
  );
}
