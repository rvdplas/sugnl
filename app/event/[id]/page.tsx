import { getAllEventIds, getEventAgenda, getEventById } from "@/lib/events";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import EventHero from "@/components/event/EventHero";
import EventAbout from "@/components/event/EventAbout";
import EventRegisterCard from "@/components/event/EventRegisterCard";
import EventAgenda from "@/components/event/EventAgenda";
import EventLocationCard from "@/components/event/EventLocationCard";
import { ArrowLeftIcon } from "@/components/event/icons";

interface PageProps {
  readonly params: Promise<{
    id: string;
  }>;
}

function splitDescription(description: string): { intro: string; body: string } {
  const [intro = "", ...rest] = description
    .replace(/\\n/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return { intro, body: rest.join("\n\n") };
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = getEventById(id);

  if (!event) {
    notFound();
  }

  const agenda = getEventAgenda(event);
  const { intro, body } = splitDescription(event.description);

  return (
    <PageContainer>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--link)] hover:opacity-80"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Events
      </Link>

      <EventHero event={event} intro={intro} />

      {/* Columns collapse via `contents` on mobile so `order` interleaves cards: About, Register, Agenda, Location. */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <div className="order-1">
            <EventAbout body={body} />
          </div>
          <div className="order-3">
            <EventAgenda agenda={agenda} />
          </div>
        </div>
        <div className="contents lg:flex lg:flex-col lg:gap-6">
          <div className="order-2">
            <EventRegisterCard event={event} />
          </div>
          <div className="order-4">
            <EventLocationCard event={event} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export function generateStaticParams() {
  return getAllEventIds().map((id) => ({ id }));
}
