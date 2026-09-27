import type { Request, Response } from 'express';
import {
  AvailabilityConfigurationError,
  getAirbnbAvailability,
} from '../services/airbnbAvailability.js';

export async function availability(_request: Request, response: Response) {
  try {
    const payload = await getAirbnbAvailability();
    response.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
    return response.json(payload);
  } catch (error) {
    if (error instanceof AvailabilityConfigurationError) {
      return response.status(500).json({ message: 'Airbnb availability is not configured' });
    }
    return response.status(502).json({ message: 'Availability temporarily unavailable' });
  }
}
