import Anthropic from '@anthropic-ai/sdk';
import { LocationInput } from './googleMapsService.js';

export interface ClaudeDistanceEstimate {
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  origin: string;
  destination: string;
  estimatedSpeed: number;
  isEstimate: true;
}

/**
 * Use Claude to estimate distance when Google Maps fails
 * This is a fallback that uses Claude's knowledge to estimate distances
 */
export async function estimateDistanceWithClaude(
  origin: LocationInput,
  destination: LocationInput,
  mode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing'
): Promise<ClaudeDistanceEstimate> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key is not configured');
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Format location strings
  const originStr = origin.address || `${origin.lat}, ${origin.lng}`;
  const destStr = destination.address || `${destination.lat}, ${destination.lng}`;

  const speedMap: Record<string, number> = {
    walking: 5,
    swimming: 3,
    pigeon: 80,
    'rock-climbing': 1,
  };

  const prompt = `You are a distance estimation assistant for a novelty email service. 
  
Estimate the distance between these two locations:
Origin: ${originStr}
Destination: ${destStr}

Provide your response in this exact JSON format (no markdown, just the JSON):
{
  "distanceKm": <estimated distance in kilometers as a number>,
  "explanation": "<brief explanation of how you estimated this>",
  "originFormatted": "<formatted origin location name>",
  "destinationFormatted": "<formatted destination location name>"
}

Be as accurate as possible based on your geographic knowledge. If coordinates are provided, use them. If addresses are provided, use your knowledge of those places.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Parse Claude's response
    const parsed = JSON.parse(responseText);
    const distanceKm = parsed.distanceKm;
    const distanceMeters = distanceKm * 1000;
    const speed = speedMap[mode];
    const durationSeconds = (distanceKm / speed) * 3600;

    return {
      distanceMeters,
      distanceText: `${distanceKm.toFixed(1)} km (estimated)`,
      durationSeconds,
      origin: parsed.originFormatted || originStr,
      destination: parsed.destinationFormatted || destStr,
      estimatedSpeed: speed,
      isEstimate: true,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to estimate distance with Claude');
  }
}
