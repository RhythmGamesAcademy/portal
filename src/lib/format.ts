const DATE_FORMAT = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tokyo",
});

export function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(`${value}T00:00:00+09:00`) : value;
  return DATE_FORMAT.format(date);
}
