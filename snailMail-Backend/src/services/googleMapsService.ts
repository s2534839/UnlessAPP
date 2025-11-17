import { Client, TravelMode } from '@googlemaps/google-maps-services-js';

export interface LocationInput {
  address?: string;
  lat?: number;
  lng?: number;
}

export interface DistanceResult {
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  origin: string;
  destination: string;
}

const client = new Client({});

/**
 * Calculate distance between two locations using Google Maps Distance Matrix API
 */
export async function calculateDistance(
  origin: LocationInput,
  destination: LocationInput,
  travelMode: TravelMode = TravelMode.walking
): Promise<DistanceResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Maps API key is not configured');
  }

  try {
    // Format origin and destination for the API
    const originParam = origin.address || `${origin.lat},${origin.lng}`;
    const destParam = destination.address || `${destination.lat},${destination.lng}`;

    const response = await client.distancematrix({
      params: {
        origins: [originParam],
        destinations: [destParam],
        mode: travelMode,
        key: apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const element = response.data.rows[0]?.elements[0];
    
    if (!element || element.status !== 'OK') {
      throw new Error(`Distance calculation failed: ${element?.status || 'Unknown error'}`);
    }

    return {
      distanceMeters: element.distance.value,
      distanceText: element.distance.text,
      durationSeconds: element.duration.value,
      origin: response.data.origin_addresses[0],
      destination: response.data.destination_addresses[0],
    };
  } catch (error) {
    console.error('Google Maps API error:', error);
    throw error;
  }
}

/**
 * Calculate distance for different transport modes
 */
export async function calculateDistanceByMode(
  origin: LocationInput,
  destination: LocationInput,
  mode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing'
): Promise<DistanceResult & { estimatedSpeed: number }> {
  // Map transport modes to Google Maps travel modes
  const travelModeMap: Record<string, TravelMode> = {
    walking: TravelMode.walking,
    swimming: TravelMode.walking, // Use walking distance as base for swimming
    pigeon: TravelMode.driving,   // Use driving as approximation for aerial distance
    'rock-climbing': TravelMode.walking, // Use walking as base
  };

  // Speed in km/h for each mode
  const speedMap: Record<string, number> = {
    walking: 5,
    swimming: 3,
    pigeon: 60,
    'rock-climbing': 1,
  };

  const travelMode = travelModeMap[mode];
  const result = await calculateDistance(origin, destination, travelMode);

  return {
    ...result,
    estimatedSpeed: speedMap[mode],
  };
}
