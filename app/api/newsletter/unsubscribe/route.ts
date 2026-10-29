import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, requestUnsubscribe } from "@/lib/newsletter";
import { sendNewsletterEmailAfterResponse } from "@/lib/newsletterMailer";
import { featureFlags } from "@/lib/featureFlags";
import {
  createRateLimiter,
  getClientIp,
  isHoneypotFilled,
  isSubmittedTooQuickly,
} from "@/lib/formGuards";

const isRateLimited = createRateLimiter(10 * 60 * 1000, 6);
const MIN_FORM_FILL_MS = 2000;

// Same response whatever the address's state, so the form never reveals who is subscribed.
const NEUTRAL_RESPONSE = {
  success: true,
  message: "Check your inbox. If this address is on our list, we've sent it a link to confirm unsubscribing.",
};

export async function POST(request: NextRequest) {
  if (!featureFlags.newsletter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    if (isRateLimited(getClientIp(request))) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { email, website, submittedAt } = await request.json();

    if (isHoneypotFilled(website)) {
      return NextResponse.json(NEUTRAL_RESPONSE, { status: 200 });
    }

    if (isSubmittedTooQuickly(submittedAt, MIN_FORM_FILL_MS)) {
      return NextResponse.json(
        { error: "Form submitted too quickly. Please review and try again." },
        { status: 400 }
      );
    }

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Confirmed by email, so nobody can unsubscribe someone else's address. Subscribing takes the same
    // round-trip, so withdrawing consent stays as easy as giving it (GDPR art. 7(3)).
    const outgoing = await requestUnsubscribe(normalizedEmail);
    if (outgoing) {
      sendNewsletterEmailAfterResponse(outgoing);
    }

    return NextResponse.json(NEUTRAL_RESPONSE, { status: 200 });
  } catch (error) {
    const { name, code } = (error ?? {}) as { name?: string; code?: string };
    // Name and code only: database errors can quote the email address.
    console.error("Newsletter unsubscribe error:", name, code);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
