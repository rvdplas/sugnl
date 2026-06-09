import { NextRequest, NextResponse } from "next/server";

const speakerRequests: Array<{
  name: string;
  email: string;
  linkedin?: string;
  sessionTitle: string;
  sessionDescription: string;
  timestamp: string;
}> = [];

const speakerRateLimit = new Map<string, number[]>();

const SPEAKER_WINDOW_MS = 60 * 60 * 1000;
const SPEAKER_MAX_REQUESTS = 3;
const MIN_FORM_FILL_MS = 5000;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (speakerRateLimit.get(ip) ?? []).filter((ts) => now - ts < SPEAKER_WINDOW_MS);
  history.push(now);
  speakerRateLimit.set(ip, history);

  return history.length > SPEAKER_MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, linkedin, sessionTitle, sessionDescription, website, submittedAt } = body;
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Hidden-field bot trap.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (typeof submittedAt !== "number" || Date.now() - submittedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(
        { error: "Form submitted too quickly. Please review and try again." },
        { status: 400 }
      );
    }

    if (!name || !email || !sessionTitle || !sessionDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email))) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const speakerRequest = {
      name: String(name).trim(),
      email: normalizedEmail,
      linkedin: linkedin ? String(linkedin).trim() : undefined,
      sessionTitle: String(sessionTitle).trim(),
      sessionDescription: String(sessionDescription).trim(),
      timestamp: new Date().toISOString(),
    };

    speakerRequests.push(speakerRequest);
    console.log("New speaker request:", speakerRequest);

    return NextResponse.json(
      {
        success: true,
        message:
          "Thanks for your submission. Speaking slots are not guaranteed and every submission is reviewed by the organizers.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Speaker request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
