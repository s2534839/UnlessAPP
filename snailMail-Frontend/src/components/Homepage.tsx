import { useState } from 'react';
import './Homepage.css';
import TransportMode from './TransportMode';
import type { TransportType } from './TransportMode';

interface TransportOption {
  type: TransportType;
  speed: number; // km/h
  speedDisplay: string;
  description: string;
}

const transportOptions: TransportOption[] = [
  {
    type: 'pigeon',
    speed: 80,
    speedDisplay: '80 km/h',
    description: 'Air mail at its finest! A trusty pigeon carries your message through the skies.',
  },
  {
    type: 'walking',
    speed: 5,
    speedDisplay: '5 km/h',
    description: 'The classic approach. Your message walks to its destination, one step at a time.',
  },
  {
    type: 'swimming',
    speed: 3,
    speedDisplay: '3 km/h',
    description: 'For water-based delivery. Your message swims across rivers, lakes, and oceans.',
  },
  {
    type: 'rock-climbing',
    speed: 1,
    speedDisplay: '1 km/h',
    description: 'The most adventurous route. Your message climbs mountains to reach its destination.',
  },
];

const Homepage = () => {
  const [senderEmail, setSenderEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderLocation, setSenderLocation] = useState('');
  const [recipientLocation, setRecipientLocation] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  // Calculate random distance between 10-500 km for demo purposes
  const calculateDistance = () => {
    return Math.floor(Math.random() * 490) + 10;
  };

  const calculateDeliveryTime = (distanceKm: number, speedKmh: number) => {
    const hours = distanceKm / speedKmh;

    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes`;
    } else if (hours < 24) {
      return `${Math.round(hours * 10) / 10} hours`;
    } else {
      const days = Math.round(hours / 24 * 10) / 10;
      return `${days} days`;
    }
  };

  const handleTransportSelect = (transport: TransportOption) => {
    if (!senderEmail || !recipientEmail || !senderLocation || !recipientLocation) {
      alert('Please fill in all fields before selecting a transport mode!');
      return;
    }

    const dist = calculateDistance();
    const time = calculateDeliveryTime(dist, transport.speed);

    setSelectedTransport(transport.type);
    setDistance(dist);
    setDeliveryTime(time);
    setShowResults(true);
  };

  const handleSendEmail = () => {
    if (!selectedTransport) {
      alert('Please select a transport mode first!');
      return;
    }

    alert(`🎉 Email sent from ${senderEmail} to ${recipientEmail}!\n\nYour message will travel ${distance} km from ${senderLocation} to ${recipientLocation}.\n\nEstimated delivery time: ${deliveryTime}\n\nTransport mode: ${selectedTransport}`);

    // Reset form
    setSenderEmail('');
    setRecipientEmail('');
    setSenderLocation('');
    setRecipientLocation('');
    setSelectedTransport(null);
    setShowResults(false);
  };

  const handleReset = () => {
    setSelectedTransport(null);
    setShowResults(false);
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1 className="homepage-title">📬 SnailMail</h1>
        <p className="homepage-subtitle">
          The world's most hilariously useless email service
        </p>
        <p className="homepage-tagline">
          Why send instantly when you can wait for days?
        </p>
      </header>

      <div className="homepage-content">
        {!showResults ? (
          <>
            <div className="email-form">
              <div className="form-section">
                <h2 className="section-title">✉️ Email Details</h2>
                <div className="form-group">
                  <label htmlFor="sender-email">Your Email</label>
                  <input
                    id="sender-email"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pixel-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-email">Recipient Email</label>
                  <input
                    id="recipient-email"
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="friend@example.com"
                    className="pixel-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-title">📍 Journey Details</h2>
                <div className="form-group">
                  <label htmlFor="sender-location">From (City, Country)</label>
                  <input
                    id="sender-location"
                    type="text"
                    value={senderLocation}
                    onChange={(e) => setSenderLocation(e.target.value)}
                    placeholder="San Francisco, USA"
                    className="pixel-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="recipient-location">To (City, Country)</label>
                  <input
                    id="recipient-location"
                    type="text"
                    value={recipientLocation}
                    onChange={(e) => setRecipientLocation(e.target.value)}
                    placeholder="New York, USA"
                    className="pixel-input"
                  />
                </div>
              </div>
            </div>

            <div className="transport-selection">
              <h2 className="section-title">🚀 Choose Your Transport</h2>
              <p className="transport-hint">
                Click on a transport mode to select it
              </p>
              <div className="transport-grid">
                {transportOptions.map((transport) => (
                  <div
                    key={transport.type}
                    className={`transport-wrapper ${
                      selectedTransport === transport.type ? 'selected' : ''
                    }`}
                    onClick={() => handleTransportSelect(transport)}
                  >
                    <TransportMode
                      type={transport.type}
                      speed={transport.speedDisplay}
                      description={transport.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="results-section">
            <div className="results-card">
              <h2 className="results-title">🎯 Delivery Summary</h2>
              <div className="results-info">
                <div className="result-item">
                  <span className="result-label">From:</span>
                  <span className="result-value">{senderEmail} ({senderLocation})</span>
                </div>
                <div className="result-item">
                  <span className="result-label">To:</span>
                  <span className="result-value">{recipientEmail} ({recipientLocation})</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Distance:</span>
                  <span className="result-value">{distance} km</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Delivery Time:</span>
                  <span className="result-value highlight">{deliveryTime}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Transport:</span>
                  <span className="result-value">
                    {selectedTransport?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              </div>

              <div className="selected-transport-preview">
                {selectedTransport && (
                  <TransportMode
                    type={selectedTransport}
                    speed={transportOptions.find(t => t.type === selectedTransport)?.speedDisplay || ''}
                    description={transportOptions.find(t => t.type === selectedTransport)?.description || ''}
                  />
                )}
              </div>

              <div className="results-actions">
                <button className="pixel-button primary" onClick={handleSendEmail}>
                  📤 Send Email
                </button>
                <button className="pixel-button secondary" onClick={handleReset}>
                  🔄 Choose Different Transport
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="homepage-footer">
        <p>Because sometimes, anticipation is better than instant gratification.</p>
      </footer>
    </div>
  );
};

export default Homepage;
