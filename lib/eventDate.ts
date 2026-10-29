/** Today's date in the Netherlands as YYYY-MM-DD, so date strings compare correctly. */
export function getDutchDate(now: Date = new Date()): string {
  return now.toLocaleDateString("sv-SE", { timeZone: "Europe/Amsterdam" });
}

// An event stays "upcoming" for its whole day (Dutch time) and counts as past from the next day.
export function isEventPast(date: string, now: Date = new Date()): boolean {
  return date < getDutchDate(now);
}
