import ical, { type DateWithTimeZone } from 'node-ical';

export type BlockedRange = { start: string; end: string };
export type AvailabilityPayload = { source: 'airbnb'; blockedRanges: BlockedRange[]; updatedAt: string };

export class AvailabilityConfigurationError extends Error {}
export class AvailabilityFetchError extends Error {}

type HalfOpenRange = { start: string; endExclusive: string };
type CacheEntry = { expiresAt: number; payload: AvailabilityPayload };

const FETCH_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 5 * 60_000;
const MAX_FEED_BYTES = 2_000_000;
let cache: CacheEntry | undefined;

function dateKey(value: DateWithTimeZone): string {
  if (value.dateOnly) return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  if (value.tz) {
    try {
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: value.tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(value);
      const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value;
      const year = part('year'), month = part('month'), day = part('day');
      if (year && month && day) return `${year}-${month}-${day}`;
    } catch {
      // Fall back to the UTC calendar date if the feed contains an unsupported TZID.
    }
  }
  return value.toISOString().slice(0, 10);
}

function addDays(value: string, amount: number): string {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day! + amount));
  return date.toISOString().slice(0, 10);
}

export function parseBlockedRanges(ics: string): BlockedRange[] {
  const parsed = ical.sync.parseICS(ics);
  const ranges: HalfOpenRange[] = [];

  for (const component of Object.values(parsed)) {
    if (!component || component.type !== 'VEVENT' || component.status === 'CANCELLED' || !component.start) continue;
    const start = dateKey(component.start);
    let endExclusive = component.end ? dateKey(component.end) : addDays(start, 1);
    if (endExclusive <= start) endExclusive = addDays(start, 1);
    ranges.push({ start, endExclusive });
  }

  ranges.sort((a, b) => a.start.localeCompare(b.start) || a.endExclusive.localeCompare(b.endExclusive));
  const merged: HalfOpenRange[] = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.endExclusive) {
      if (range.endExclusive > previous.endExclusive) previous.endExclusive = range.endExclusive;
    } else {
      merged.push({ ...range });
    }
  }

  return merged.map(range => ({ start: range.start, end: addDays(range.endExclusive, -1) }));
}

export async function getAirbnbAvailability(): Promise<AvailabilityPayload> {
  const url = process.env.AIRBNB_ICAL_URL?.trim();
  if (!url) throw new AvailabilityConfigurationError('Airbnb calendar is not configured');
  if (cache && cache.expiresAt > Date.now()) return cache.payload;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'text/calendar, text/plain;q=0.9' },
    });
    if (!response.ok) throw new AvailabilityFetchError('Airbnb calendar request failed');
    const content = await response.text();
    if (!content || content.length > MAX_FEED_BYTES) throw new AvailabilityFetchError('Airbnb calendar response was invalid');
    const payload: AvailabilityPayload = {
      source: 'airbnb',
      blockedRanges: parseBlockedRanges(content),
      updatedAt: new Date().toISOString(),
    };
    cache = { expiresAt: Date.now() + CACHE_TTL_MS, payload };
    return payload;
  } catch (error) {
    if (error instanceof AvailabilityFetchError) throw error;
    throw new AvailabilityFetchError('Airbnb calendar request failed');
  } finally {
    clearTimeout(timeout);
  }
}
