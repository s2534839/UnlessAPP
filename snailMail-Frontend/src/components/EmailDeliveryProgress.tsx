import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { TransportType } from './TransportMode';
import TransportMode from './TransportMode';
import './EmailDeliveryProgress.css';

interface EmailDeliveryProgressProps {
  jobId: string;
  transportMode: TransportType;
  from: string;
  to: string;
  estimatedDeliveryTime: number;
  originalDeliveryTime: number;
  speedMultiplier: number;
  onComplete: () => void;
}

const EmailDeliveryProgress = ({
  jobId,
  transportMode,
  from,
  to,
  estimatedDeliveryTime,
  originalDeliveryTime,
  speedMultiplier,
  onComplete,
}: EmailDeliveryProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'in-transit' | 'delivered' | 'failed'>('in-transit');
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(estimatedDeliveryTime);

  useEffect(() => {
    // Poll for status updates every second
    const interval = setInterval(async () => {
      try {
        const response = await apiService.getEmailStatus(jobId);

        if (response.data) {
          setProgress(response.data.progress);
          setStatus(response.data.status);
          setElapsed(response.data.elapsedSeconds);
          setRemaining(response.data.remainingSeconds);

          if (response.data.status === 'delivered' || response.data.status === 'failed') {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 3000); // Show success message for 3 seconds
          }
        }
      } catch (error) {
        console.error('Failed to get email status:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, onComplete]);

  const formatTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  };

  const transportEmoji: Record<TransportType, string> = {
    pigeon: '🕊️',
    walking: '🚶',
    swimming: '🏊',
    'rock-climbing': '🧗',
  };

  const transportDesc: Record<TransportType, { speed: string; description: string }> = {
    pigeon: { speed: '80 km/h', description: 'Flying through the skies' },
    walking: { speed: '5 km/h', description: 'Walking step by step' },
    swimming: { speed: '3 km/h', description: 'Swimming across waters' },
    'rock-climbing': { speed: '1 km/h', description: 'Climbing mountains' },
  };

  return (
    <div className="email-delivery-overlay">
      <div className="email-delivery-container">
        <div className="delivery-header">
          <h2 className="delivery-title">
            {status === 'delivered' ? '✅ Delivered!' : status === 'failed' ? '❌ Delivery Failed' : '📬 Email In Transit'}
          </h2>
          <p className="delivery-subtitle">
            {status === 'delivered'
              ? 'Your SnailMail has been successfully delivered!'
              : status === 'failed'
              ? 'Sorry, something went wrong with the delivery'
              : 'Your message is on its way...'}
          </p>
        </div>

        <div className="transport-visualization">
          <TransportMode
            type={transportMode}
            speed={transportDesc[transportMode].speed}
            description={transportDesc[transportMode].description}
          />
        </div>

        <div className="progress-section">
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
                background: status === 'delivered' ? 'linear-gradient(90deg, #4caf50, #8bc34a)' : status === 'failed' ? 'linear-gradient(90deg, #f44336, #e91e63)' : 'linear-gradient(90deg, #667eea, #764ba2)',
              }}
            >
              <div className="progress-glow"></div>
            </div>
          </div>
          <div className="progress-percentage">{progress.toFixed(2)}%</div>
        </div>

        <div className="delivery-details">
          <div className="detail-grid">
            <div className="detail-box">
              <span className="detail-icon">📨</span>
              <div className="detail-content">
                <span className="detail-label">From</span>
                <span className="detail-value">{from}</span>
              </div>
            </div>

            <div className="detail-box">
              <span className="detail-icon">📩</span>
              <div className="detail-content">
                <span className="detail-label">To</span>
                <span className="detail-value">{to}</span>
              </div>
            </div>

            <div className="detail-box">
              <span className="detail-icon">⏱️</span>
              <div className="detail-content">
                <span className="detail-label">Elapsed</span>
                <span className="detail-value">{formatTime(elapsed)}</span>
              </div>
            </div>

            <div className="detail-box">
              <span className="detail-icon">⏳</span>
              <div className="detail-content">
                <span className="detail-label">Remaining</span>
                <span className="detail-value">{formatTime(remaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {speedMultiplier > 1 && (
          <div className="speed-notice">
            <span className="notice-icon">⚡</span>
            <p>
              <strong>Demo Mode Active:</strong> Delivery sped up {speedMultiplier}x for demonstration
              purposes. Actual delivery would take <strong>{formatTime(originalDeliveryTime)}</strong>!
            </p>
          </div>
        )}

        <div className="status-message">
          {status === 'in-transit' && (
            <p className="transit-message">
              {transportEmoji[transportMode]} Your email is being delivered via{' '}
              {transportMode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}...
            </p>
          )}
          {status === 'delivered' && (
            <p className="success-message">
              🎉 Success! The recipient will receive your message shortly.
            </p>
          )}
          {status === 'failed' && <p className="error-message">Please try again later or contact support.</p>}
        </div>
      </div>
    </div>
  );
};

export default EmailDeliveryProgress;
