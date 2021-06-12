export function stringifyDate(date: Date): string {
  return date.toLocaleDateString("en-ZA", {
    month: "numeric",
    day: "numeric",
  });
}

export function stringifyBoundaries(boundaries: [Date, Date]): string {
  return `${stringifyDate(boundaries[0])} — ${stringifyDate(boundaries[1])}`;
}

export function daysAfter(days: number, now: Date): Date {
  now = new Date(now);
  return new Date(now.setDate(now.getDate() + days));
}
