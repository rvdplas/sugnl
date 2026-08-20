import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function buildCsp(nonce: string, isDevelopment: boolean) {
  const scriptSrc = isDevelopment
    ? `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://va.vercel-scripts.com`
    : `script-src 'self' 'nonce-${nonce}' https://va.vercel-scripts.com`;

  const connectSrc = isDevelopment
    ? "connect-src 'self' https://vitals.vercel-insights.com ws://localhost:* http://localhost:*"
    : "connect-src 'self' https://vitals.vercel-insights.com";

  const directives = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https://images.unsplash.com https://mvp.sitecore.com https://mvp.sitecore.net https://www.gravatar.com https://secure.gravatar.com",
    connectSrc,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce, isDevelopment);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
