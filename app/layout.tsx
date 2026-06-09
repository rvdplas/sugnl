import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sugnl.nl";

export const metadata: Metadata = {
  title: "SUGNL - Community Events",
  description: "Join our community events, meetups, and tech talks",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodyFont.variable} ${headingFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
            try {
              const theme = localStorage.getItem("theme");
              if (theme === "light" || theme === "dark") {
                document.documentElement.setAttribute("data-theme", theme);
              }
            } catch (_) {}
          })();`}
        </Script>
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SpeedInsights />
        <Analytics />
        <footer className="mt-16 border-t border-[color:var(--nav-line)] bg-[color:var(--nav-bg)]">
          <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-[color:var(--nav-text-muted)]">
            <p>© {new Date().getFullYear()} SUGNL Community. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
