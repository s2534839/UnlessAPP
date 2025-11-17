import { LocationInput, calculateDistanceByMode } from './googleMapsService.js';
import { estimateDistanceWithClaude } from './claudeService.js';

export interface DeliveryEstimate {
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  deliveryTimeSeconds: number;
  deliveryTimeText: string;
  origin: string;
  destination: string;
  transportMode: string;
  speedKmH: number;
  isEstimate: boolean;
  method: 'google-maps' | 'claude-estimate';
}

/**
 * Calculate delivery time based on transport mode
 * This is the main service that orchestrates the distance calculation
 */
export async function calculateDeliveryTime(
  origin: LocationInput,
  destination: LocationInput,
  mode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing'
): Promise<DeliveryEstimate> {
  let result: any;
  let method: 'google-maps' | 'claude-estimate' = 'google-maps';
  let isEstimate = false;

  try {
    // Try Google Maps first
    console.log(`Attempting to calculate distance via Google Maps (mode: ${mode})`);
    result = await calculateDistanceByMode(origin, destination, mode);
  } catch (googleError) {
    console.warn('Google Maps failed, falling back to Claude:', googleError);
    
    try {
      // Fall back to Claude
      console.log(`Falling back to Claude estimation (mode: ${mode})`);
      result = await estimateDistanceWithClaude(origin, destination, mode);
      method = 'claude-estimate';
      isEstimate = true;
    } catch (claudeError) {
      console.error('Both Google Maps and Claude failed:', claudeError);
      throw new Error('Unable to calculate distance: Both Google Maps and Claude services failed');
    }
  }

  // Calculate delivery time based on the transport mode speed
  const distanceKm = result.distanceMeters / 1000;
  const deliveryTimeHours = distanceKm / result.estimatedSpeed;
  const deliveryTimeSeconds = deliveryTimeHours * 3600;

  // Format delivery time text
  const deliveryTimeText = formatDeliveryTime(deliveryTimeSeconds);

  return {
    distanceMeters: result.distanceMeters,
    distanceText: result.distanceText,
    durationSeconds: result.durationSeconds,
    deliveryTimeSeconds,
    deliveryTimeText,
    origin: result.origin,
    destination: result.destination,
    transportMode: mode,
    speedKmH: result.estimatedSpeed,
    isEstimate,
    method,
  };
}

/**
 * Format delivery time into human-readable text
 */
function formatDeliveryTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} day${days > 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0 && days === 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  return parts.length > 0 ? parts.join(', ') : '< 1 minute';
}

/**
 * Calculate delivery times for all transport modes
 */
export async function calculateAllDeliveryTimes(
  origin: LocationInput,
  destination: LocationInput
): Promise<Record<string, DeliveryEstimate>> {
  const modes: Array<'walking' | 'swimming' | 'pigeon' | 'rock-climbing'> = [
    'walking',
    'swimming',
    'pigeon',
    'rock-climbing',
  ];

  const results: Record<string, DeliveryEstimate> = {};

  // Calculate all modes in parallel
  await Promise.all(
    modes.map(async (mode) => {
      try {
        results[mode] = await calculateDeliveryTime(origin, destination, mode);
      } catch (error) {
        console.error(`Failed to calculate delivery time for ${mode}:`, error);
        throw error;
      }
    })
  );

  return results;
}
