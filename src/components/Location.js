import { useRef, useState } from "react";

export default function Location(){
  const frame = useRef();
  const [isScanning, setIsScanning] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [status, setStatus] = useState('');

  const loadMap = () => {
    if(!navigator.geolocation){
      alert("Location not supported");
      return;
    }

    setIsScanning(true);
    setStatus('Initializing GPS satellites...');

    // Simulate scanning animation
    setTimeout(() => setStatus('Triangulating position...'), 800);
    setTimeout(() => setStatus('Decoding coordinates...'), 1600);
    setTimeout(() => setStatus('Establishing secure connection...'), 2400);

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ latitude, longitude });
        
        setTimeout(() => {
          setIsDecoding(true);
          setStatus('Rendering holographic map...');
        }, 3000);

        setTimeout(() => {
          frame.current.src =
            `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`;
          setIsScanning(false);
          setIsDecoding(false);
          setStatus('Location locked ✓');
        }, 4000);
      },
      err => {
        setIsScanning(false);
        setStatus('❌ Access denied');
        setTimeout(() => setStatus(''), 2000);
      }
    );
  };

  const sendSMS = () => {
    if (!coordinates) {
      alert("Please load location first");
      return;
    }

    const { latitude, longitude } = coordinates;
    const msg = `🌍 My location: https://maps.google.com/?q=${latitude},${longitude}`;
    window.location.href = `sms:8923484333?body=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="location-container">
      
      {/* Header with HUD */}
      <div className="location-header">
        <div className="hud-element">
          <div className="hud-line"></div>
          <div className="hud-corner tl"></div>
          <div className="hud-corner tr"></div>
          <div className="hud-corner bl"></div>
          <div className="hud-corner br"></div>
        </div>
        <h2 className="location-title">
          <span className="icon-wrapper">📍</span>
          GEOLOCATION SYSTEM
        </h2>
        <p className="location-subtitle">QUANTUM GPS TRACKING v2.0</p>
      </div>

      {/* Status Display */}
      {status && (
        <div className="status-bar">
          <div className="status-indicator"></div>
          <span>{status}</span>
        </div>
      )}

      {/* Coordinates Display */}
      {coordinates && (
        <div className="coords-display">
          <div className="coord-item">
            <span className="coord-label">LAT</span>
            <span className="coord-value">{coordinates.latitude.toFixed(6)}</span>
          </div>
          <div className="coord-divider"></div>
          <div className="coord-item">
            <span className="coord-label">LNG</span>
            <span className="coord-value">{coordinates.longitude.toFixed(6)}</span>
          </div>
        </div>
      )}

      {/* Scanning Animation Overlay */}
      {isScanning && (
        <div className="scan-overlay">
          <div className="scan-grid">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="grid-line" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
          <div className="scan-circle circle-1"></div>
          <div className="scan-circle circle-2"></div>
          <div className="scan-circle circle-3"></div>
          <div className="radar-sweep"></div>
          <div className="center-target">
            <div className="target-ring ring-1"></div>
            <div className="target-ring ring-2"></div>
            <div className="target-ring ring-3"></div>
            <div className="target-dot"></div>
          </div>
        </div>
      )}

      {/* Decoding Animation */}
      {isDecoding && (
        <div className="decode-overlay">
          <div className="circuit-board">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="circuit-line" style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}></div>
            ))}
          </div>
          <div className="data-stream">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="data-bit" style={{animationDelay: `${i * 0.05}s`}}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container">
        <div className="map-frame-border">
          <iframe
            ref={frame}
            title="map"
            className="map-frame"
          />
          {!coordinates && (
            <div className="map-placeholder">
              <div className="placeholder-icon">🌐</div>
              <p>AWAITING COORDINATES</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          onClick={loadMap}
          disabled={isScanning}
          className="action-btn scan-btn"
        >
          <div className="btn-glow"></div>
          <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{isScanning ? 'SCANNING...' : 'INITIATE SCAN'}</span>
        </button>

        <button
          onClick={sendSMS}
          disabled={!coordinates || isScanning}
          className="action-btn send-btn"
        >
          <div className="btn-glow"></div>
          <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>TRANSMIT DATA</span>
        </button>
      </div>

      <style>{`
        .location-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 16px;
          position: relative;
        }

        /* Header */
        .location-header {
          text-align: center;
          position: relative;
          padding: 20px;
        }

        .hud-element {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hud-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00fff9, transparent);
          animation: hudPulse 2s ease-in-out infinite;
        }

        .hud-corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border: 2px solid #00fff9;
        }

        .hud-corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .hud-corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .hud-corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .hud-corner.br { bottom: 0; right: 0; border-left: none; border-top: none; }

        @keyframes hudPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .location-title {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #00fff9, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
          letter-spacing: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .icon-wrapper {
          font-size: 24px;
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .location-subtitle {
          font-size: 10px;
          color: #666;
          letter-spacing: 2px;
          font-weight: 600;
        }

        /* Status Bar */
        .status-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: rgba(0, 255, 249, 0.1);
          border: 1px solid rgba(0, 255, 249, 0.3);
          border-radius: 10px;
          font-size: 12px;
          color: #00fff9;
          font-weight: 600;
          animation: statusBlink 1s ease-in-out infinite;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00fff9;
          box-shadow: 0 0 10px #00fff9;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes statusBlink {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Coordinates Display */
        .coords-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 14px;
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(0, 255, 249, 0.2);
          border-radius: 12px;
          font-family: 'Courier New', monospace;
        }

        .coord-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .coord-label {
          font-size: 10px;
          color: #666;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .coord-value {
          font-size: 16px;
          color: #00ff88;
          font-weight: 700;
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }

        .coord-divider {
          width: 1px;
          height: 30px;
          background: linear-gradient(180deg, transparent, #00fff9, transparent);
        }

        /* Scanning Animation */
        .scan-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .scan-grid {
          position: absolute;
          inset: 0;
          opacity: 0.3;
        }

        .grid-line {
          position: absolute;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #00fff9, transparent);
          animation: gridScan 2s ease-in-out infinite;
        }

        .grid-line:nth-child(odd) {
          background: linear-gradient(90deg, transparent, #ff006e, transparent);
        }

        @keyframes gridScan {
          0% {
            transform: translateY(0) scaleX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
            transform: translateY(350px) scaleX(1);
          }
          100% {
            transform: translateY(700px) scaleX(0);
            opacity: 0;
          }
        }

        .scan-circle {
          position: absolute;
          border: 2px solid #00fff9;
          border-radius: 50%;
          animation: expandCircle 3s ease-out infinite;
        }

        .circle-1 { width: 100px; height: 100px; animation-delay: 0s; }
        .circle-2 { width: 100px; height: 100px; animation-delay: 1s; border-color: #ff006e; }
        .circle-3 { width: 100px; height: 100px; animation-delay: 2s; border-color: #8b5cf6; }

        @keyframes expandCircle {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .radar-sweep {
          position: absolute;
          width: 200px;
          height: 200px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(0, 255, 249, 0.5) 45deg,
            transparent 90deg
          );
          border-radius: 50%;
          animation: radarSpin 2s linear infinite;
        }

        @keyframes radarSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .center-target {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .target-ring {
          position: absolute;
          border: 2px solid #00fff9;
          border-radius: 50%;
          animation: targetPulse 2s ease-in-out infinite;
        }

        .ring-1 { inset: 0; animation-delay: 0s; }
        .ring-2 { inset: -10px; animation-delay: 0.3s; }
        .ring-3 { inset: -20px; animation-delay: 0.6s; }

        @keyframes targetPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.2); }
        }

        .target-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background: #00fff9;
          border-radius: 50%;
          box-shadow: 0 0 20px #00fff9;
        }

        /* Decode Animation */
        .decode-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 100;
          overflow: hidden;
        }

        .circuit-board {
          position: absolute;
          inset: 0;
        }

        .circuit-line {
          position: absolute;
          width: 2px;
          height: 40px;
          background: linear-gradient(180deg, transparent, #00fff9, transparent);
          animation: circuitFlow 2s ease-in-out infinite;
        }

        @keyframes circuitFlow {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .data-stream {
          position: absolute;
          inset: 0;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          padding: 20px;
          gap: 2px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          overflow: hidden;
        }

        .data-bit {
          color: #00ff88;
          opacity: 0;
          animation: bitAppear 0.5s ease-in-out forwards;
        }

        @keyframes bitAppear {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          50% {
            opacity: 1;
            color: #00fff9;
          }
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
        }

        /* Map Container */
        .map-container {
          flex: 1;
          position: relative;
          min-height: 300px;
        }

        .map-frame-border {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          border: 2px solid rgba(0, 255, 249, 0.3);
          background: rgba(20, 20, 20, 0.5);
        }

        .map-frame {
          width: 100%;
          height: 100%;
          border: 0;
          border-radius: 16px;
        }

        .map-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.5);
        }

        .placeholder-icon {
          font-size: 48px;
          animation: iconFloat 3s ease-in-out infinite;
        }

        .map-placeholder p {
          color: #666;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          letter-spacing: 1px;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-glow {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .action-btn:hover:not(:disabled) .btn-glow {
          opacity: 1;
          animation: btnGlow 1.5s ease-in-out infinite;
        }

        @keyframes btnGlow {
          0%, 100% {
            box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.4);
          }
        }

        .btn-icon {
          position: relative;
          z-index: 1;
        }

        .action-btn span {
          position: relative;
          z-index: 1;
        }

        .scan-btn {
          background: linear-gradient(135deg, #00fff9, #00d4ff);
          color: #000;
          box-shadow: 0 8px 24px rgba(0, 255, 249, 0.3);
        }

        .scan-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 255, 249, 0.5);
        }

        .send-btn {
          background: linear-gradient(135deg, #00ff88, #10b981);
          color: #000;
          box-shadow: 0 8px 24px rgba(0, 255, 136, 0.3);
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 255, 136, 0.5);
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}