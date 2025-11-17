import { useState } from 'react';
import { apiService } from '../services/api';
import type { DeliveryEstimate } from '../services/api';
import TransportResults from './TransportResults';
import './DeliveryCalculator.css';

const DeliveryCalculator = () => {
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, DeliveryEstimate> | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originAddress.trim() || !destinationAddress.trim()) {
      setError('Please enter both origin and destination addresses');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await apiService.calculateAll(
        { address: originAddress },
        { address: destinationAddress }
      );
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate delivery times');
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginAddress('');
    setDestinationAddress('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="delivery-calculator">
      <header className="calculator-header">
        <h1 className="calculator-title">📬 SnailMail</h1>
        <p className="calculator-subtitle">
          The world's most hilariously slow email delivery service
        </p>
        <p className="calculator-tagline">
          Why send instantly when you can wait for days?
        </p>
      </header>

      {!results ? (
        <div className="calculator-form-container">
          <form onSubmit={handleCalculate} className="calculator-form">
            <div className="form-section">
              <h2 className="section-title">📍 Journey Details</h2>

              <div className="form-group">
                <label htmlFor="origin">From (City, Country or Address)</label>
                <input
                  id="origin"
                  type="text"
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  placeholder="e.g., San Francisco, CA or 123 Main St, New York"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">To (City, Country or Address)</label>
                <input
                  id="destination"
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="e.g., New York, NY or 456 Park Ave, Los Angeles"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="calculate-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Calculating...
                  </>
                ) : (
                  <>
                    🚀 Calculate Delivery Times
                  </>
                )}
              </button>

              <p className="form-hint">
                We'll show you delivery times for all our ridiculously slow transport methods!
              </p>
            </div>
          </form>
        </div>
      ) : (
        <TransportResults
          results={results}
          origin={originAddress}
          destination={destinationAddress}
          onReset={handleReset}
        />
      )}

      <footer className="calculator-footer">
        <p>Because sometimes, anticipation is better than instant gratification.</p>
        <p className="footer-tech">Powered by Google Maps Distance Matrix API</p>
      </footer>
    </div>
  );
};

export default DeliveryCalculator;
