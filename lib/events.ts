import { Event } from "@/types";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const eventsDirectory = path.join(process.cwd(), "content", "events");

function isEventFile(filename: string): boolean {
  return filename.endsWith(".json") && !filename.includes(".template.");
}

function isValidActivity(value: unknown): value is Event["activities"][number] {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const activity = value as Record<string, unknown>;
  if (typeof activity.subject !== "string" || typeof activity.startTime !== "string") {
    return false;
  }

  if (activity.type === "break" || activity.type === "info") {
    return true;
  }

  if (typeof activity.speaker === "undefined") {
    return true;
  }

  if (typeof activity.description !== "string") {
    return false;
  }

  if (typeof activity.speaker !== "object" || activity.speaker === null) {
    return false;
  }

  const speaker = activity.speaker as Record<string, unknown>;
  return typeof speaker.name === "string" && typeof speaker.image === "string";
}

function isValidEvent(value: unknown): value is Event {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.date === "string" &&
    typeof event.startTime === "string" &&
    typeof event.endTime === "string" &&
    typeof event.location === "string" &&
    typeof event.registrationUrl === "string" &&
    typeof event.description === "string" &&
    Array.isArray(event.activities) &&
    event.activities.length >= 1 &&
    event.activities.every(isValidActivity) &&
    typeof event.isPast === "boolean"
  );
}

function loadEventsFromFiles(): Event[] {
  const files = readdirSync(eventsDirectory)
    .filter(isEventFile)
    .sort((a, b) => a.localeCompare(b));

  return files.map((filename) => {
    const filePath = path.join(eventsDirectory, filename);
    const raw = readFileSync(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);

    console.log(`Loaded event file: ${filename}`);

    if (!isValidEvent(parsed)) {
      throw new Error(`Invalid event shape in file: ${filename}`);
    }

    return parsed;
  });
}

export const events: Event[] = loadEventsFromFiles();

export function getUpcomingEvents(): Event[] {
  return events
    .filter((event) => !event.isPast)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getPastEvents(): Event[] {
  return events
    .filter((event) => event.isPast)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id);
}

export function getAllEventIds(): string[] {
  return events.map((event) => event.id);
}

export type AgendaItem =
  | { type: "fixed"; label: string; startTime: string }
  | { type: "activity"; activity: Event["activities"][number] };

function getAgendaItemStartTime(item: AgendaItem): string {
  return item.type === "fixed" ? item.startTime : item.activity.startTime;
}

export function getEventAgenda(event: Event): AgendaItem[] {
  return [...event.activities.map((activity) => ({ type: "activity", activity } as const))].sort((a, b) =>
    getAgendaItemStartTime(a).localeCompare(getAgendaItemStartTime(b))
  );
}
