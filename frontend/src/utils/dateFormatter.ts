export function formatDateRange(start: string, end: string) {
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);

  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  if (sameYear) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
    });

    return `${formatter.format(startDate)} – ${formatter.format(endDate)}, ${startDate.getFullYear()}`;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return `${formatter.format(startDate)} – ${formatter.format(endDate)}`;
}
