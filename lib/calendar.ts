import { Event } from "@/types";

const EVENT_TIME_ZONE = "Europe/Amsterdam";

function getTimeZoneOffsetMinutes(utcGuess: Date): number {
  const offsetLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(utcGuess)
    .find((part) => part.type === "timeZoneName")?.value;

  const match = offsetLabel?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) {
    return 0;
  }

  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

function toUtcDate(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return new Date(utcGuess.getTime() - getTimeZoneOffsetMinutes(utcGuess) * 60_000);
}

function toCompactUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function getEventRange(event: Event): { start: Date; end: Date } {
  return {
    start: toUtcDate(event.date, event.startTime),
    end: toUtcDate(event.date, event.endTime),
  };
}

function getPlainDescription(event: Event): string {
  return event.description.replace(/\\n/g, "\n").trim();
}

export function getGoogleCalendarUrl(event: Event): string {
  const { start, end } = getEventRange(event);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCompactUtc(start)}/${toCompactUtc(end)}`,
    details: getPlainDescription(event),
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function foldIcsLine(line: string): string {
  const chunks: string[] = [];
  for (let index = 0; index < line.length; index += 73) {
    chunks.push(line.slice(index, index + 73));
  }
  return chunks.join("\r\n ");
}

export function buildIcs(event: Event): string {
  const { start, end } = getEventRange(event);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SUGNL//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@sugnl`,
    `DTSTAMP:${toCompactUtc(new Date())}`,
    `DTSTART:${toCompactUtc(start)}`,
    `DTEND:${toCompactUtc(end)}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(getPlainDescription(event))}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join("\r\n") + "\r\n";
}
