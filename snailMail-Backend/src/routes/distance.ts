import express, { Request, Response } from 'express';
import { calculateDeliveryTime, calculateAllDeliveryTimes } from '../services/distanceCalculator.js';
import { LocationInput } from '../services/googleMapsService.js';

const router = express.Router();

/**
 * POST /api/distance/calculate
 * Calculate delivery time for a specific transport mode
 * 
 * Body:
 * {
 *   "origin": { "address": "New York, NY" } or { "lat": 40.7128, "lng": -74.0060 },
 *   "destination": { "address": "Los Angeles, CA" } or { "lat": 34.0522, "lng": -118.2437 },
 *   "mode": "walking" | "swimming" | "pigeon" | "rock-climbing"
 * }
 */
router.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { origin, destination, mode } = req.body;

    // Validation
    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both origin and destination are required',
      });
    }

    if (!mode) {
      return res.status(400).json({
        error: 'Missing transport mode',
        message: 'mode is required (walking, swimming, pigeon, or rock-climbing)',
      });
    }

    const validModes = ['walking', 'swimming', 'pigeon', 'rock-climbing'];
    if (!validModes.includes(mode)) {
      return res.status(400).json({
        error: 'Invalid transport mode',
        message: `mode must be one of: ${validModes.join(', ')}`,
      });
    }

    // Validate location format
    if (!validateLocation(origin) || !validateLocation(destination)) {
      return res.status(400).json({
        error: 'Invalid location format',
        message: 'Locations must have either an address or lat/lng coordinates',
      });
    }

    // Calculate delivery time
    const result = await calculateDeliveryTime(origin, destination, mode);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error calculating distance:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message || 'An error occurred while calculating the distance',
    });
  }
});

/**
 * POST /api/distance/calculate-all
 * Calculate delivery times for all transport modes
 * 
 * Body:
 * {
 *   "origin": { "address": "New York, NY" } or { "lat": 40.7128, "lng": -74.0060 },
 *   "destination": { "address": "Los Angeles, CA" } or { "lat": 34.0522, "lng": -118.2437 }
 * }
 */
router.post('/calculate-all', async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.body;

    // Validation
    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both origin and destination are required',
      });
    }

    // Validate location format
    if (!validateLocation(origin) || !validateLocation(destination)) {
      return res.status(400).json({
        error: 'Invalid location format',
        message: 'Locations must have either an address or lat/lng coordinates',
      });
    }

    // Calculate delivery times for all modes
    const results = await calculateAllDeliveryTimes(origin, destination);

    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error calculating distances:', error);
    res.status(500).json({
      error: 'Calculation failed',
      message: error.message || 'An error occurred while calculating the distances',
    });
  }
});

/**
 * GET /api/distance/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Distance calculation service is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Validate location input format
 */
function validateLocation(location: LocationInput): boolean {
  if (!location) return false;

  // Must have either address or coordinates
  const hasAddress = typeof location.address === 'string' && location.address.length > 0;
  const hasCoordinates = 
    typeof location.lat === 'number' && 
    typeof location.lng === 'number' &&
    location.lat >= -90 && location.lat <= 90 &&
    location.lng >= -180 && location.lng <= 180;

  return hasAddress || hasCoordinates;
}

export default router;
