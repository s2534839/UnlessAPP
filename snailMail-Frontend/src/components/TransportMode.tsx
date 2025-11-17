import './TransportMode.css';

export type TransportType = 'walking' | 'swimming' | 'pigeon' | 'rock-climbing';

interface TransportModeProps {
  type: TransportType;
  speed: string;
  description: string;
}

const TransportMode = ({ type, speed, description }: TransportModeProps) => {
  return (
    <div className="transport-card">
      <h3 className="transport-title">{type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h3>
      <div className={`animation-container ${type}`}>
        {type === 'walking' && (
          <div className="walking-animation">
            <div className="walker">
              <div className="walker-body">
                <div className="walker-head"></div>
                <div className="walker-torso"></div>
                <div className="walker-leg walker-leg-left"></div>
                <div className="walker-leg walker-leg-right"></div>
                <div className="walker-arm walker-arm-left"></div>
                <div className="walker-arm walker-arm-right"></div>
              </div>
            </div>
            <div className="ground"></div>
          </div>
        )}

        {type === 'swimming' && (
          <div className="swimming-animation">
            <div className="swimmer">
              <div className="swimmer-body">
                <div className="swimmer-head"></div>
                <div className="swimmer-torso"></div>
                <div className="swimmer-arm swimmer-arm-left"></div>
                <div className="swimmer-arm swimmer-arm-right"></div>
                <div className="swimmer-leg swimmer-leg-left"></div>
                <div className="swimmer-leg swimmer-leg-right"></div>
              </div>
              <div className="water-splash"></div>
            </div>
            <div className="waves">
              <div className="wave wave-1"></div>
              <div className="wave wave-2"></div>
              <div className="wave wave-3"></div>
            </div>
          </div>
        )}

        {type === 'pigeon' && (
          <div className="pigeon-animation">
            <div className="pigeon">
              <div className="pigeon-body">
                <div className="pigeon-head"></div>
                <div className="pigeon-torso"></div>
                <div className="pigeon-wing pigeon-wing-left"></div>
                <div className="pigeon-wing pigeon-wing-right"></div>
                <div className="pigeon-tail"></div>
              </div>
            </div>
            <div className="clouds">
              <div className="cloud cloud-1"></div>
              <div className="cloud cloud-2"></div>
              <div className="cloud cloud-3"></div>
            </div>
          </div>
        )}

        {type === 'rock-climbing' && (
          <div className="climbing-animation">
            <div className="cliff">
              <div className="rock rock-1"></div>
              <div className="rock rock-2"></div>
              <div className="rock rock-3"></div>
              <div className="rock rock-4"></div>
            </div>
            <div className="climber">
              <div className="climber-body">
                <div className="climber-head"></div>
                <div className="climber-torso"></div>
                <div className="climber-arm climber-arm-left"></div>
                <div className="climber-arm climber-arm-right"></div>
                <div className="climber-leg climber-leg-left"></div>
                <div className="climber-leg climber-leg-right"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="transport-info">
        <p className="transport-speed"><strong>Speed:</strong> {speed}</p>
        <p className="transport-description">{description}</p>
      </div>
    </div>
  );
};

export default TransportMode;
