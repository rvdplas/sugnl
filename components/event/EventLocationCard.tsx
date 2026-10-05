import type { ComponentType, SVGProps } from "react";
import { CarIcon, ExternalLinkIcon, PinIcon } from "@/components/event/icons";
import MapEmbed from "@/components/event/MapEmbed";
import { cardClassName, cardHeadingClassName } from "@/components/event/styles";
import { parseLocation } from "@/lib/events";
import { Event } from "@/types";

type EventLocationCardProps = {
  readonly event: Event;
};

function getMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

type LocationEntryProps = {
  readonly label: string;
  readonly name: string;
  readonly addressLines: string[];
  readonly mapsQuery: string;
  readonly linkLabel: string;
  readonly Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

function LocationEntry({ label, name, addressLines, mapsQuery, linkLabel, Icon }: LocationEntryProps) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--muted)]">{label}</h3>
      <address className="flex items-start gap-3 not-italic">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--link)]" />
        <span>
          <span className="block font-semibold text-[color:var(--ink)]">{name}</span>
          {addressLines.map((line) => (
            <span key={line} className="block text-sm text-[color:var(--muted)]">
              {line}
            </span>
          ))}
          <a
            href={getMapsSearchUrl(mapsQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--link)] hover:opacity-80"
          >
            {linkLabel}
            <ExternalLinkIcon className="h-3.5 w-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </span>
      </address>
    </div>
  );
}

export default function EventLocationCard({ event }: EventLocationCardProps) {
  const { venue, addressLines } = parseLocation(event.location);
  const address = addressLines.length > 0 ? addressLines.join(", ") : event.location;
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const parking = event.parking?.trim();
  const [parkingName = "", ...parkingAddressLines] = parking
    ? parking.split(",").map((line) => line.trim()).filter(Boolean)
    : [];

  return (
    <section aria-labelledby="event-location" className={cardClassName}>
      <h2 id="event-location" className={`${cardHeadingClassName} mb-5`}>
        {parking ? "Locations" : "Location"}
      </h2>

      <div className="mb-6 space-y-5">
        <LocationEntry
          label="Venue"
          name={venue}
          addressLines={addressLines}
          mapsQuery={address}
          linkLabel="Open in Google Maps"
          Icon={PinIcon}
        />
        {parking && (
          <div className="border-t border-[color:var(--line)] pt-5">
            <LocationEntry
              label="Parking"
              name={parkingName}
              addressLines={parkingAddressLines}
              mapsQuery={parking}
              linkLabel="Directions to parking"
              Icon={CarIcon}
            />
          </div>
        )}
      </div>

      <div className="h-52 overflow-hidden rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)]">
        <MapEmbed src={embedUrl} title={`Map showing ${venue}`} />
      </div>
    </section>
  );
}
