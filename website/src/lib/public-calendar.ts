/** A calendar link is opt-in; there is no fallback to an unverified tenant. */
export function getPublicCalendarUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}
