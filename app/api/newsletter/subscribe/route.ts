import { NextRequest, NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter";

const subscribeRateLimit = new Map<string, number[]>();

const SUBSCRIBE_WINDOW_MS = 10 * 60 * 1000;
const SUBSCRIBE_MAX_REQUESTS = 6;
const MIN_FORM_FILL_MS = 2000;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (subscribeRateLimit.get(ip) ?? []).filter((ts) => now - ts < SUBSCRIBE_WINDOW_MS);
  history.push(now);
  subscribeRateLimit.set(ip, history);

  return history.length > SUBSCRIBE_MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email, firstName, website, submittedAt, consent } = body;

    // Bots often fill hidden fields; return success to avoid probing.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (typeof submittedAt !== "number" || Date.now() - submittedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(
        { error: "Form submitted too quickly. Please review and try again." },
        { status: 400 }
      );
    }

    if (!email || consent !== true) {
      return NextResponse.json(
        { error: "Email and consent are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedFirstName = typeof firstName === "string" ? firstName.trim() : "";

    const result = await subscribeToNewsletter({
      email: normalizedEmail,
      firstName: normalizedFirstName || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
