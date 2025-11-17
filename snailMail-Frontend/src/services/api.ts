// API Service for SnailMail Backend Integration

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface LocationInput {
  address?: string;
  lat?: number;
  lng?: number;
}

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

export interface CalculateRequest {
  origin: LocationInput;
  destination: LocationInput;
  mode?: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';
}

export interface CalculateResponse {
  success: boolean;
  data: DeliveryEstimate;
  error?: string;
}

export interface CalculateAllResponse {
  success: boolean;
  data: {
    walking: DeliveryEstimate;
    swimming: DeliveryEstimate;
    pigeon: DeliveryEstimate;
    'rock-climbing': DeliveryEstimate;
  };
  error?: string;
}

export interface SendEmailRequest {
  from: string;
  to: string;
  subject: string;
  message: string;
  transportMode: 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';
  deliveryTimeSeconds: number;
  speedMultiplier?: number;
}

export interface SendEmailResponse {
  success: boolean;
  data?: {
    jobId: string;
    status: string;
    transportMode: string;
    estimatedDeliveryTime: number;
    originalDeliveryTime: number;
    speedMultiplier: number;
    message: string;
  };
  error?: string;
}

export interface EmailStatusResponse {
  success: boolean;
  data?: {
    id: string;
    status: 'pending' | 'in-transit' | 'delivered' | 'failed';
    progress: number;
    transportMode: string;
    from: string;
    to: string;
    elapsedSeconds: number;
    remainingSeconds: number;
    totalDeliverySeconds: number;
  };
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Calculate delivery estimate for a single transport mode
   */
  async calculateSingle(request: CalculateRequest): Promise<DeliveryEstimate> {
    const response = await fetch(`${this.baseUrl}/api/distance/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: CalculateResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Calculation failed');
    }

    return result.data;
  }

  /**
   * Calculate delivery estimates for all transport modes
   */
  async calculateAll(
    origin: LocationInput,
    destination: LocationInput
  ): Promise<Record<string, DeliveryEstimate>> {
    const response = await fetch(`${this.baseUrl}/api/distance/calculate-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ origin, destination }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: CalculateAllResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Calculation failed');
    }

    return result.data;
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/distance/health`);
      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Send an email with delayed delivery
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    const response = await fetch(`${this.baseUrl}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: SendEmailResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to send email');
    }

    return result;
  }

  /**
   * Get email delivery status
   */
  async getEmailStatus(jobId: string): Promise<EmailStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/email/status/${jobId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: EmailStatusResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to get email status');
    }

    return result;
  }
}

export const apiService = new ApiService();
export default apiService;
