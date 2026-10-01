import { buildIcs } from "@/lib/calendar";
import { getAllEventIds, getEventById } from "@/lib/events";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getAllEventIds().map((id) => ({ id }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="sugnl-${event.id.replace(/[^a-zA-Z0-9-]/g, "")}.ics"`,
    },
  });
}
