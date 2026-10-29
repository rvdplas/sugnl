import { NextRequest, NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/newsletter";
import { featureFlags } from "@/lib/featureFlags";

export async function POST(request: NextRequest) {
  if (!featureFlags.newsletter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { token } = await request.json();
    if (typeof token !== "string" || token === "") {
      return NextResponse.json({ error: "Missing token." }, { status: 400 });
    }

    if (!(await confirmSubscription(token))) {
      return NextResponse.json(
        { error: "This link is invalid or has expired. Please subscribe again." },
        { status: 410 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const { name, code } = (error ?? {}) as { name?: string; code?: string };
    // Name and code only: database errors can quote the email address.
    console.error("Newsletter confirm error:", name, code);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
