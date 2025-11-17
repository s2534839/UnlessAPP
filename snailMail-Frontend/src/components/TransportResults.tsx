import { useState } from 'react';
import { apiService } from '../services/api';
import type { DeliveryEstimate } from '../services/api';
import TransportMode from './TransportMode';
import type { TransportType } from './TransportMode';
import EmailComposer from './EmailComposer';
import EmailDeliveryProgress from './EmailDeliveryProgress';
import './TransportResults.css';

interface TransportResultsProps {
  results: Record<string, DeliveryEstimate>;
  origin: string;
  destination: string;
  onReset: () => void;
}

interface TransportOption {
  type: TransportType;
  emoji: string;
  speedDisplay: string;
  description: string;
  estimate: DeliveryEstimate;
}

const TransportResults = ({ results, origin, destination, onReset }: TransportResultsProps) => {
  const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
  const [composingEmail, setComposingEmail] = useState<TransportType | null>(null);
  const [emailJob, setEmailJob] = useState<{
    jobId: string;
    transportMode: TransportType;
    from: string;
    to: string;
    estimatedDeliveryTime: number;
    originalDeliveryTime: number;
    speedMultiplier: number;
  } | null>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(3600); // Default: 1 hour = 1 second
  const [emailError, setEmailError] = useState<string | null>(null);

  const transportDescriptions: Record<TransportType, { emoji: string; description: string }> = {
    pigeon: {
      emoji: '🕊️',
      description: 'Air mail at its finest! A trusty pigeon carries your message through the skies.',
    },
    walking: {
      emoji: '🚶',
      description: 'The classic approach. Your message walks to its destination, one step at a time.',
    },
    swimming: {
      emoji: '🏊',
      description: 'For water-based delivery. Your message swims across rivers, lakes, and oceans.',
    },
    'rock-climbing': {
      emoji: '🧗',
      description: 'The most adventurous route. Your message climbs mountains to reach its destination.',
    },
  };

  const transportOptions: TransportOption[] = Object.entries(results).map(([mode, estimate]) => ({
    type: mode as TransportType,
    emoji: transportDescriptions[mode as TransportType].emoji,
    speedDisplay: `${estimate.speedKmH} km/h`,
    description: transportDescriptions[mode as TransportType].description,
    estimate,
  }));

  // Sort by delivery time (fastest first)
  transportOptions.sort((a, b) => a.estimate.deliveryTimeSeconds - b.estimate.deliveryTimeSeconds);

  const handleTransportClick = (transport: TransportOption) => {
    setSelectedTransport(selectedTransport === transport.type ? null : transport.type);
  };

  const handleSendEmail = (transportMode: TransportType) => {
    setComposingEmail(transportMode);
    setEmailError(null);
  };

  const handleEmailSend = async (from: string, to: string, subject: string, message: string) => {
    if (!composingEmail) return;

    setEmailError(null);

    try {
      const transport = transportOptions.find((t) => t.type === composingEmail);
      if (!transport) throw new Error('Transport not found');

      const response = await apiService.sendEmail({
        from,
        to,
        subject,
        message,
        transportMode: composingEmail,
        deliveryTimeSeconds: transport.estimate.deliveryTimeSeconds,
        speedMultiplier,
      });

      if (response.data) {
        setEmailJob({
          jobId: response.data.jobId,
          transportMode: composingEmail,
          from,
          to,
          estimatedDeliveryTime: response.data.estimatedDeliveryTime,
          originalDeliveryTime: response.data.originalDeliveryTime,
          speedMultiplier: response.data.speedMultiplier,
        });
        setComposingEmail(null);
      }
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    }
  };

  const handleDeliveryComplete = () => {
    setEmailJob(null);
  };

  return (
    <div className="transport-results">
      <div className="results-header">
        <h2 className="results-title">🎯 Delivery Options</h2>
        <div className="route-summary">
          <div className="route-info">
            <span className="route-label">From:</span>
            <span className="route-value">{origin}</span>
          </div>
          <div className="route-arrow">→</div>
          <div className="route-info">
            <span className="route-label">To:</span>
            <span className="route-value">{destination}</span>
          </div>
        </div>

        {transportOptions.length > 0 && (
          <div className="distance-summary">
            <span className="distance-icon">📏</span>
            <span className="distance-text">
              Total Distance: <strong>{transportOptions[0].estimate.distanceText}</strong>
            </span>
            {transportOptions[0].estimate.method === 'claude-estimate' && (
              <span className="estimate-badge" title="Google Maps was unavailable, using AI estimation">
                ✨ AI Estimate
              </span>
            )}
          </div>
        )}
      </div>

      <div className="transport-grid">
        {transportOptions.map((transport) => (
          <div
            key={transport.type}
            className={`transport-card-wrapper ${
              selectedTransport === transport.type ? 'selected' : ''
            }`}
            onClick={() => handleTransportClick(transport)}
          >
            <div className="transport-header">
              <h3 className="transport-name">
                {transport.emoji} {transport.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h3>
              <div className="delivery-time-badge">
                {transport.estimate.deliveryTimeText}
              </div>
            </div>

            <TransportMode
              type={transport.type}
              speed={transport.speedDisplay}
              description={transport.description}
            />

            {selectedTransport === transport.type && (
              <div className="transport-details">
                <div className="detail-row">
                  <span className="detail-label">Distance:</span>
                  <span className="detail-value">{transport.estimate.distanceText}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Speed:</span>
                  <span className="detail-value">{transport.estimate.speedKmH} km/h</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Delivery Time:</span>
                  <span className="detail-value highlight">{transport.estimate.deliveryTimeText}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Route:</span>
                  <span className="detail-value small">
                    {transport.estimate.origin} → {transport.estimate.destination}
                  </span>
                </div>
                <div className="send-email-section">
                  <button
                    className="send-email-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendEmail(transport.type);
                    }}
                  >
                    📧 Send Email via {transport.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="results-actions">
        <div className="speed-control">
          <label htmlFor="speed-multiplier">
            Demo Speed Multiplier: <strong>{speedMultiplier}x</strong>
          </label>
          <input
            id="speed-multiplier"
            type="range"
            min="1"
            max="86400"
            step="1"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseInt(e.target.value))}
            className="speed-slider"
          />
          <div className="speed-presets">
            <button onClick={() => setSpeedMultiplier(60)} className="preset-button">
              1 min = 1s
            </button>
            <button onClick={() => setSpeedMultiplier(3600)} className="preset-button">
              1 hr = 1s
            </button>
            <button onClick={() => setSpeedMultiplier(86400)} className="preset-button">
              1 day = 1s
            </button>
          </div>
          <p className="speed-help">
            Adjust how fast emails are delivered for demo purposes. Higher = faster delivery!
          </p>
        </div>

        <button className="reset-button" onClick={onReset}>
          🔄 Calculate New Route
        </button>
      </div>

      {emailError && (
        <div className="email-error">
          <span className="error-icon">⚠️</span>
          <span>{emailError}</span>
        </div>
      )}

      <div className="results-footer">
        <p className="footer-note">
          💡 <strong>Tip:</strong> Click on any transport method to see detailed information and send emails!
        </p>
      </div>

      {composingEmail && (
        <EmailComposer
          transportMode={composingEmail}
          estimate={transportOptions.find((t) => t.type === composingEmail)!.estimate}
          origin={origin}
          destination={destination}
          onSend={handleEmailSend}
          onCancel={() => setComposingEmail(null)}
        />
      )}

      {emailJob && (
        <EmailDeliveryProgress
          jobId={emailJob.jobId}
          transportMode={emailJob.transportMode}
          from={emailJob.from}
          to={emailJob.to}
          estimatedDeliveryTime={emailJob.estimatedDeliveryTime}
          originalDeliveryTime={emailJob.originalDeliveryTime}
          speedMultiplier={emailJob.speedMultiplier}
          onComplete={handleDeliveryComplete}
        />
      )}
    </div>
  );
};

export default TransportResults;
