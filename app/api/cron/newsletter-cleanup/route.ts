import { NextRequest, NextResponse } from "next/server";
import { purgeExpired } from "@/lib/newsletter";

// Invoked daily by Vercel Cron (see vercel.json), which sends CRON_SECRET as a bearer token.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const purged = await purgeExpired();
    return NextResponse.json({ success: true, purged }, { status: 200 });
  } catch (error) {
    const { name, code } = (error ?? {}) as { name?: string; code?: string };
    // Name and code only: database errors can quote the email address.
    console.error("Newsletter cleanup error:", name, code);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
