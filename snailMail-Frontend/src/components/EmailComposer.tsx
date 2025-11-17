import { useState } from 'react';
import type { DeliveryEstimate } from '../services/api';
import type { TransportType } from './TransportMode';
import './EmailComposer.css';

interface EmailComposerProps {
  transportMode: TransportType;
  estimate: DeliveryEstimate;
  origin: string;
  destination: string;
  onSend: (from: string, to: string, subject: string, message: string) => void;
  onCancel: () => void;
}

const EmailComposer = ({ transportMode, estimate, origin, destination, onSend, onCancel }: EmailComposerProps) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!from.trim()) {
      newErrors.from = 'Sender email is required';
    } else if (!emailRegex.test(from)) {
      newErrors.from = 'Invalid email address';
    }

    if (!to.trim()) {
      newErrors.to = 'Recipient email is required';
    } else if (!emailRegex.test(to)) {
      newErrors.to = 'Invalid email address';
    }

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSend(from, to, subject, message);
    }
  };

  const transportEmoji: Record<TransportType, string> = {
    pigeon: '🕊️',
    walking: '🚶',
    swimming: '🏊',
    'rock-climbing': '🧗',
  };

  return (
    <div className="email-composer-overlay">
      <div className="email-composer">
        <div className="composer-header">
          <h2 className="composer-title">
            {transportEmoji[transportMode]} Compose SnailMail
          </h2>
          <p className="composer-subtitle">
            Send via {transportMode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </p>
        </div>

        <div className="delivery-info-banner">
          <div className="info-item">
            <span className="info-label">Route:</span>
            <span className="info-value">{origin} → {destination}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Distance:</span>
            <span className="info-value">{estimate.distanceText}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Delivery Time:</span>
            <span className="info-value highlight">{estimate.deliveryTimeText}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="composer-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="from">From (Your Email)</label>
              <input
                id="from"
                type="email"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="you@example.com"
                className={errors.from ? 'error' : ''}
              />
              {errors.from && <span className="field-error">{errors.from}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="to">To (Recipient Email)</label>
              <input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="friend@example.com"
                className={errors.to ? 'error' : ''}
              />
              {errors.to && <span className="field-error">{errors.to}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Message subject"
              className={errors.subject ? 'error' : ''}
            />
            {errors.subject && <span className="field-error">{errors.subject}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={8}
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </div>

          <div className="composer-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="send-button">
              📤 Send SnailMail
            </button>
          </div>
        </form>

        <div className="composer-footer">
          <p>
            ⚠️ <strong>Warning:</strong> Your email will actually take{' '}
            <strong>{estimate.deliveryTimeText}</strong> to be delivered!
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;
