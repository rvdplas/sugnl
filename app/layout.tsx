import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import { siteUrl } from "@/lib/siteUrl";
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
      </head>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SpeedInsights />
        <Analytics />
        <CookieConsentBanner />
        <footer className="mt-16 border-t border-[color:var(--nav-line)] bg-[color:var(--nav-bg)]">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-[color:var(--nav-text-muted)]">
            <p>© {new Date().getFullYear()} SUGNL Community. All rights reserved.</p>
            <button
              type="button"
              data-cc="show-preferencesModal"
              className="mt-2 underline-offset-4 hover:text-[color:var(--nav-text)] hover:underline"
            >
              Cookie settings
            </button>
          </div>
        </footer>
      </body>
    </html>
  );
}
