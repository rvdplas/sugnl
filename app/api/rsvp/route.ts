import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/events";

// In a production app, you'd store RSVPs in a database
// For now, we'll just validate and log them
const rsvps: Array<{
  eventId: string;
  name: string;
  email: string;
  timestamp: string;
}> = [];

const rsvpRateLimit = new Map<string, number[]>();

const RSVP_WINDOW_MS = 10 * 60 * 1000;
const RSVP_MAX_REQUESTS = 5;
const MIN_FORM_FILL_MS = 3000;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (rsvpRateLimit.get(ip) ?? []).filter((ts) => now - ts < RSVP_WINDOW_MS);
  history.push(now);
  rsvpRateLimit.set(ip, history);

  return history.length > RSVP_MAX_REQUESTS;
}

export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json(
      { error: "Missing eventId query parameter" },
      { status: 400 }
    );
  }

  const event = getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const attendeeCount = rsvps.filter((rsvp) => rsvp.eventId === eventId).length;
  return NextResponse.json({ attendeeCount }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, name, email, website, submittedAt } = body;
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Bots often fill hidden fields; treat as success to avoid probing.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (typeof submittedAt !== "number" || Date.now() - submittedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(
        { error: "Form submitted too quickly. Please review and try again." },
        { status: 400 }
      );
    }

    // Validate input
    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if event exists
    const event = getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if event is in the past
    if (event.isPast) {
      return NextResponse.json(
        { error: "Cannot RSVP to past events" },
        { status: 400 }
      );
    }

    const alreadyRegistered = rsvps.some(
      (rsvp) => rsvp.eventId === eventId && rsvp.email === normalizedEmail
    );
    if (alreadyRegistered) {
      return NextResponse.json(
        {
          error: "This email is already registered for this event",
          attendeeCount: rsvps.filter((rsvp) => rsvp.eventId === eventId).length,
        },
        { status: 409 }
      );
    }

    // Create RSVP record
    const rsvp = {
      eventId,
      name,
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
    };

    // In production, save to database
    rsvps.push(rsvp);
    console.log("New RSVP:", rsvp);
    console.log("Total RSVPs:", rsvps.length);

    // In production, you'd also:
    // - Send confirmation email
    // - Update attendee count
    // - Store in database

    return NextResponse.json(
      {
        success: true,
        message: "RSVP received successfully",
        attendeeCount: rsvps.filter((item) => item.eventId === eventId).length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("RSVP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
