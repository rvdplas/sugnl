import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import SiteBanner from "@/components/SiteBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import { siteUrl } from "@/lib/siteUrl";
import { getUpcomingBanners } from "@/lib/siteBanner";
import { connection } from "next/server";
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "SUGNL - Community Events",
  description: "Join our community events, meetups, and tech talks",
  metadataBase: siteUrl,
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The CSP nonce is per request; cached HTML carries a stale one and its inline hydration scripts get blocked.
  await connection();
  const banners = await getUpcomingBanners();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
      </head>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[color:var(--button-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--focus-ring)]"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <SiteBanner banners={banners} />
        <main id="main" className="min-h-screen">{children}</main>
        <SpeedInsights />
        <Analytics />
        <CookieConsentBanner />
        <footer className="mt-16 border-t border-[color:var(--nav-line)] bg-[color:var(--nav-bg)]">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-[color:var(--nav-text-muted)]">
            <p>© {new Date().getFullYear()} SUGNL Community. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <Link
                href="/privacy"
                className="underline-offset-4 hover:text-[color:var(--nav-text)] hover:underline"
              >
                Privacy statement
              </Link>
              <button
                type="button"
                data-cc="show-preferencesModal"
                className="underline-offset-4 hover:text-[color:var(--nav-text)] hover:underline"
              >
                Cookie settings
              </button>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
