// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Location {
  address?: string;
  lat?: number;
  lng?: number;
}

export interface DistanceRequest {
  origin: Location;
  destination: Location;
  mode?: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';
}

export interface DistanceResult {
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
  method: string;
}

export interface DistanceResponse {
  success: boolean;
  data: DistanceResult;
  error?: string;
}

export interface AllDistancesResponse {
  success: boolean;
  data: {
    walking: DistanceResult;
    swimming: DistanceResult;
    pigeon: DistanceResult;
    'rock-climbing': DistanceResult;
  };
  error?: string;
}

export interface EmailRequest {
  senderEmail: string;
  recipientEmail: string;
  senderLocation: string;
  recipientLocation: string;
  transportMode: string;
  deliveryTime: string;
  distance: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Calculate distance for a single transport mode
   */
  async calculateDistance(request: DistanceRequest): Promise<DistanceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/distance/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate distance');
      }

      return data;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  /**
   * Calculate distances for all transport modes
   */
  async calculateAllDistances(
    origin: Location,
    destination: Location
  ): Promise<AllDistancesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/distance/calculate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origin, destination }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate distances');
      }

      return data;
    } catch (error) {
      console.error('Error calculating all distances:', error);
      throw error;
    }
  }

  /**
   * Send email with delivery information
   */
  async sendEmail(request: EmailRequest): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/distance/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
