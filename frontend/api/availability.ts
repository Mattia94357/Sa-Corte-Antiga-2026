import {
  AvailabilityConfigurationError,
  getAirbnbAvailability,
} from './_lib/airbnbAvailability.js';

const json = (body: unknown, status = 200, cache = false) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    ...(cache ? { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' } : {}),
  },
});

export default {
  async fetch(request: Request) {
    if (request.method !== 'GET') return json({ message: 'Method not allowed' }, 405);
    try {
      return json(await getAirbnbAvailability(), 200, true);
    } catch (error) {
      if (error instanceof AvailabilityConfigurationError) {
        return json({ message: 'Airbnb availability is not configured' }, 500);
      }
      return json({ message: 'Availability temporarily unavailable' }, 502);
    }
  },
};
