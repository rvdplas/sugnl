import { getDutchDate } from "./eventDate.ts";

export interface BannerInput {
  /** Plain text with optional links written as [link text](/page) or [link text](https://…). */
  message: string;
  /** Dutch calendar days as YYYY-MM-DD, both inclusive; null means no limit on that side. */
  startsOn: string | null;
  endsOn: string | null;
  /** Whether visitors can close the banner. */
  dismissible: boolean;
}

export interface BannerFormFields {
  message: unknown;
  startsOn: unknown;
  endsOn: unknown;
  /** A checkbox: "on" when checked, absent otherwise. */
  dismissible: unknown;
}

/** A piece of a banner message: plain text, or a link when href is set. */
export interface BannerSegment {
  text: string;
  href?: string;
}

/** Counts the text visitors see, so long URLs do not eat the limit. */
export const MAX_MESSAGE_LENGTH = 250;
/** Counts everything typed, including link markup. */
export const MAX_MESSAGE_SOURCE_LENGTH = 1000;

const LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

function field(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// Only site paths and https links: anything else (javascript:, data:, //host) could run or redirect off-site.
function isSafeUrl(url: string): boolean {
  if (url.startsWith("/")) {
    return !url.startsWith("//") && !url.startsWith("/\\");
  }

  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

/** Splits a message into text and links. A link with an unsafe URL stays plain text. */
export function parseBannerMessage(message: string): BannerSegment[] {
  const segments: BannerSegment[] = [];
  let position = 0;

  for (const match of message.matchAll(LINK_PATTERN)) {
    if (match.index > position) {
      segments.push({ text: message.slice(position, match.index) });
    }
    const [markup, text, href] = match;
    segments.push(isSafeUrl(href) ? { text, href } : { text: markup });
    position = match.index + markup.length;
  }

  if (position < message.length) {
    segments.push({ text: message.slice(position) });
  }

  return segments;
}

/** The text visitors see, without link markup. */
export function getVisibleText(message: string): string {
  return parseBannerMessage(message)
    .map((segment) => segment.text)
    .join("");
}

/** Empty means no limit; anything else must be a real YYYY-MM-DD date. Returns undefined when invalid. */
function parseDate(value: unknown): string | null | undefined {
  const text = field(value);
  if (!text) {
    return null;
  }

  // Round-tripping rejects dates like 2026-02-30 that Date would roll over.
  const time = Date.parse(`${text}T00:00:00Z`);
  const isValid = /^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(time) && new Date(time).toISOString().startsWith(text);
  return isValid ? text : undefined;
}

/** Validates the Admin's banner form. Returns null when the input is not acceptable. */
export function parseBannerInput(fields: BannerFormFields): BannerInput | null {
  // Line breaks would collapse into spaces on the site anyway.
  const message = field(fields.message).replace(/\s*\n\s*/g, " ");
  const startsOn = parseDate(fields.startsOn);
  const endsOn = parseDate(fields.endsOn);

  if (
    !message ||
    message.length > MAX_MESSAGE_SOURCE_LENGTH ||
    getVisibleText(message).length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  // Reject rather than silently show a link as plain text.
  if ([...message.matchAll(LINK_PATTERN)].some(([, , href]) => !isSafeUrl(href))) {
    return null;
  }

  // A one-day banner starts and ends on the same date.
  if (startsOn === undefined || endsOn === undefined || (startsOn && endsOn && endsOn < startsOn)) {
    return null;
  }

  return { message, startsOn, endsOn, dismissible: fields.dismissible === "on" };
}

/** Whether a banner shows today in the Netherlands: from its start date through its end date. */
export function isBannerLive(banner: Pick<BannerInput, "startsOn" | "endsOn">, now: Date = new Date()): boolean {
  const today = getDutchDate(now);
  return (!banner.startsOn || banner.startsOn <= today) && (!banner.endsOn || today <= banner.endsOn);
}
