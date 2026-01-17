import { useState, useEffect, useRef } from "react";

export default function Decrypt() {
  const [enc, setEnc] = useState("");
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const canvasRef = useRef(null);
  const hexCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const hexAnimationRef = useRef(null);
  const circuitNodes = useRef([]);
  const hexagons = useRef([]);
  const particles = useRef([]);

  // Hexagonal particle background
  useEffect(() => {
    const canvas = hexCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initHexagons();
    };

    const initHexagons = () => {
      hexagons.current = [];
      const hexSize = 30;
      const cols = Math.ceil(canvas.width / (hexSize * 1.5)) + 2;
      const rows = Math.ceil(canvas.height / (hexSize * Math.sqrt(3))) + 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * hexSize * 1.5;
          const y = row * hexSize * Math.sqrt(3) + (col % 2) * hexSize * Math.sqrt(3) / 2;
          hexagons.current.push({
            x, y, size: hexSize,
            phase: Math.random() * Math.PI * 2,
            speed: 0.002 + Math.random() * 0.003
          });
        }
      }

      // Initialize particles
      particles.current = [];
      for (let i = 0; i < (isDecrypting ? 50 : 25); i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isDecrypting ? 1.5 : 0.5),
          vy: (Math.random() - 0.5) * (isDecrypting ? 1.5 : 0.5),
          radius: Math.random() * 2 + 1,
          color: isDecrypting ? ['#00fff9', '#ff006e', '#8b5cf6'][Math.floor(Math.random() * 3)] : '#8b5cf6',
          life: 1
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawHexagon = (ctx, x, y, size) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + size * Math.cos(angle);
        const hy = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hexagons
      const time = Date.now() * 0.001;
      hexagons.current.forEach(hex => {
        hex.phase += hex.speed;
        const pulse = Math.sin(hex.phase) * 0.5 + 0.5;
        const opacity = isDecrypting ? pulse * 0.2 : pulse * 0.08;

        drawHexagon(ctx, hex.x, hex.y, hex.size);
        ctx.strokeStyle = isDecrypting
          ? `rgba(0, 255, 249, ${opacity})`
          : `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = isDecrypting ? 1.5 : 1;
        ctx.stroke();
      });

      // Draw and update particles
      particles.current.forEach((p, i) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = isDecrypting ? 10 : 5;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw trails
        if (isDecrypting) {
          ctx.beginPath();
          ctx.arc(p.x - p.vx * 3, p.y - p.vy * 3, p.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '66';
          ctx.fill();
        }
      });

      // Draw scanning line when decrypting
      if (isDecrypting) {
        const scanY = (time * 100) % canvas.height;
        const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        gradient.addColorStop(0, 'rgba(0, 255, 249, 0)');
        gradient.addColorStop(0.5, 'rgba(0, 255, 249, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 255, 249, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, scanY - 50, canvas.width, 100);
      }

      hexAnimationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(hexAnimationRef.current);
    };
  }, [isDecrypting]);

  // Circuit animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes
    const initNodes = () => {
      circuitNodes.current = [];
      const nodeCount = isDecrypting ? 45 : 25;

      for (let i = 0; i < nodeCount; i++) {
        circuitNodes.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isDecrypting ? 3 : 1),
          vy: (Math.random() - 0.5) * (isDecrypting ? 3 : 1),
          radius: Math.random() * 4 + 2,
          connections: [],
          color: i % 4 === 0 ? '#ff006e' : i % 3 === 0 ? '#8b5cf6' : i % 2 === 0 ? '#3b82f6' : '#00fff9'
        });
      }

      // Create connections
      circuitNodes.current.forEach((node, i) => {
        node.connections = [];
        circuitNodes.current.forEach((other, j) => {
          if (i !== j) {
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              node.connections.push(j);
            }
          }
        });
      });
    };

    initNodes();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections first with energy flow
      circuitNodes.current.forEach((node, i) => {
        node.connections.forEach(connIndex => {
          const other = circuitNodes.current[connIndex];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);

            const opacity = 0.2 * (1 - dist / 150);
            ctx.strokeStyle = isDecrypting
              ? `rgba(0, 255, 249, ${opacity * 3})`
              : `rgba(139, 92, 246, ${opacity})`;

            ctx.lineWidth = isDecrypting ? 2.5 : 1.5;
            ctx.stroke();

            // Draw energy pulses along connections when decrypting
            if (isDecrypting && Math.random() > 0.95) {
              const t = (Date.now() / 1000) % 1;
              const px = node.x + (other.x - node.x) * t;
              const py = node.y + (other.y - node.y) * t;

              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#00fff9';
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        });
      });

      // Draw nodes
      circuitNodes.current.forEach((node, i) => {
        // Move node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node with pulse effect
        ctx.beginPath();
        const pulse = Math.sin(Date.now() / 200 + i) * 0.5 + 1;
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);

        if (isDecrypting) {
          ctx.fillStyle = node.color;
          ctx.shadowBlur = 20;
          ctx.shadowColor = node.color;
        } else {
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#8b5cf6';
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw inner glow for decrypting nodes
        if (isDecrypting) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Outer glow ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * pulse * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = node.color + '33';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Draw decrypting progress path
      if (isDecrypting && progress > 0) {
        drawProgressPath(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawProgressPath = (ctx) => {
      const width = canvas.width;
      const height = canvas.height;
      const p = progress / 100;

      // Main path
      ctx.beginPath();
      const startX = width * 0.1;
      const startY = height * 0.3;
      ctx.moveTo(startX, startY);

      // Create a circuit-like path
      const points = [
        { x: width * 0.3, y: startY },
        { x: width * 0.3, y: height * 0.5 },
        { x: width * 0.1, y: height * 0.5 },
        { x: width * 0.1, y: height * 0.7 },
        { x: width * 0.9, y: height * 0.7 }
      ];

      let totalLength = 0;
      let lastX = startX;
      let lastY = startY;

      // Calculate total path length
      for (const point of points) {
        const segLen = Math.sqrt(Math.pow(point.x - lastX, 2) + Math.pow(point.y - lastY, 2));
        totalLength += segLen;
        lastX = point.x;
        lastY = point.y;
      }

      let drawnLength = 0;
      lastX = startX;
      lastY = startY;
      let currentX = startX;
      let currentY = startY;

      // Draw path based on progress
      for (const point of points) {
        const segLen = Math.sqrt(Math.pow(point.x - lastX, 2) + Math.pow(point.y - lastY, 2));
        const segProgress = Math.min(1, (p * totalLength - drawnLength) / segLen);

        if (segProgress > 0) {
          currentX = lastX + (point.x - lastX) * segProgress;
          currentY = lastY + (point.y - lastY) * segProgress;
          ctx.lineTo(currentX, currentY);
        }

        drawnLength += segLen;
        lastX = point.x;
        lastY = point.y;

        if (drawnLength >= p * totalLength) break;
      }

      // Style the path
      ctx.strokeStyle = '#00fff9';
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#00fff9';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw moving energy ball
      if (p > 0 && p < 1) {
        ctx.beginPath();
        ctx.arc(currentX, currentY, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ff006e';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff006e';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Inner glow
        ctx.beginPath();
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Trailing particles
        for (let i = 1; i <= 3; i++) {
          const trailP = Math.max(0, p - i * 0.02);
          let trailDrawn = 0;
          let trailLastX = startX;
          let trailLastY = startY;
          let trailX = startX;
          let trailY = startY;

          for (const point of points) {
            const segLen = Math.sqrt(Math.pow(point.x - trailLastX, 2) + Math.pow(point.y - trailLastY, 2));
            const segProgress = Math.min(1, (trailP * totalLength - trailDrawn) / segLen);

            if (segProgress > 0) {
              trailX = trailLastX + (point.x - trailLastX) * segProgress;
              trailY = trailLastY + (point.y - trailLastY) * segProgress;
            }

            trailDrawn += segLen;
            trailLastX = point.x;
            trailLastY = point.y;

            if (trailDrawn >= trailP * totalLength) break;
          }

          ctx.beginPath();
          ctx.arc(trailX, trailY, 4 - i, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 0, 110, ${0.6 - i * 0.2})`;
          ctx.fill();
        }
      }

      // Draw end point
      if (p >= 1) {
        ctx.beginPath();
        ctx.arc(width * 0.9, height * 0.7, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff88';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#00ff88';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Success ring pulse
        const ringPulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(width * 0.9, height * 0.7, 15 * ringPulse, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isDecrypting, progress]);

  const copyToClipboard = async () => {
    try {
      // Extract just the decrypted text without the success message
      const textToCopy = out.replace("✅ DECRYPTION SUCCESSFUL!\n\n", "");
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const decrypt = async () => {
    if (!enc.trim() || !key.trim()) {
      setOut("❌ Both encrypted text and key are required");
      setIsSuccess(false);
      return;
    }

    setIsDecrypting(true);
    setProgress(0);
    setOut("🔓 Initializing neural decryption matrix...");

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 70);

    try {
      // Add some delay for animation
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Actual decryption logic
      const data = Uint8Array.from(atob(enc), c => c.charCodeAt(0));
      const keyBuf = new TextEncoder().encode(key).slice(0, 16);
      const k = await crypto.subtle.importKey("raw", keyBuf, { name: "AES-CBC" }, false, ["decrypt"]);
      const iv = new Uint8Array(16);
      const res = await crypto.subtle.decrypt({ name: "AES-CBC", iv }, k, data);
      const result = new TextDecoder().decode(res);

      clearInterval(progressInterval);
      setProgress(100);
      setOut(`✅ DECRYPTION SUCCESSFUL!\n\n${result}`);
      setIsSuccess(true);

      // Add success effect
      setTimeout(() => {
        const msgElement = document.querySelector('.decrypt-msg');
        if (msgElement) {
          msgElement.classList.add('success-glow');
          setTimeout(() => msgElement.classList.remove('success-glow'), 2000);
        }
      }, 100);

    } catch {
      clearInterval(progressInterval);
      setOut("❌ DECRYPTION FAILED - Invalid key or corrupted data");
      setProgress(0);
      setIsSuccess(false);
      setCopied(false);
    } finally {
      setTimeout(() => {
        setIsDecrypting(false);
        if (progress === 100) {
          setTimeout(() => setProgress(0), 1500);
        }
      }, 1500);
    }
  };

  return (
    <div className="panel active" id="decryptPanel">
      <canvas ref={hexCanvasRef} className="hex-canvas" />
      <canvas ref={canvasRef} className="circuit-canvas" />

      <div className="header">
        <h2 className={isDecrypting ? "glitch" : ""}>🔐 AES DECRYPTION</h2>
        <div className="user-name">NEURAL DECRYPTION MATRIX</div>
      </div>

      <div className="toast" style={{ display: isDecrypting ? 'block' : 'none' }}>
        ⚡ BREAKING ENCRYPTION MATRIX... {Math.floor(progress)}%
      </div>

      <div className="card full">
        <div className="label">ENCRYPTED TEXT (BASE64)</div>
        <textarea
          value={enc}
          onChange={e => setEnc(e.target.value)}
          placeholder="Paste your encrypted text here..."
          disabled={isDecrypting}
          className={isDecrypting ? 'locked' : ''}
        />
      </div>

      <div className="card full">
        <div className="label">SECRET KEY</div>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="Enter your 16/24/32 byte key"
          disabled={isDecrypting}
          className={isDecrypting ? 'locked' : ''}
        />
      </div>

      <button onClick={decrypt} disabled={isDecrypting} className={isDecrypting ? 'decrypting' : ''}>
        {isDecrypting ? (
          <>
            <span className="spinner"></span>
            <span className="button-text">DECRYPTING... {Math.floor(progress)}%</span>
          </>
        ) : (
          <>
            <span className="button-icon">⚡</span>
            <span className="button-text">INITIATE DECRYPTION</span>
          </>
        )}
      </button>

      {isDecrypting && (
        <div className="card full progress-card">
          <div className="label">DECRYPTION PROGRESS</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
            <div className="progress-ticks">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="tick" style={{ left: `${i * 10}%` }}></div>
              ))}
            </div>
          </div>
          <div className="progress-text">
            {progress < 25 ? "⚙️ Initializing quantum processors..." :
              progress < 50 ? "🔍 Analyzing encryption pattern..." :
                progress < 75 ? "⚡ Validating cryptographic key..." :
                  progress < 95 ? "🔓 Breaking encryption matrix..." :
                    "✨ Finalizing decryption..."}
            <span className="progress-percent">{Math.floor(progress)}%</span>
          </div>
        </div>
      )}

      <div className="card full">
        <div className="label">DECRYPTED OUTPUT</div>
        <div className={`decrypt-msg ${out.includes('✅') ? 'success' : out.includes('❌') ? 'error' : ''}`}>
          {out || "Decrypted text will appear here..."}
        </div>
        {isSuccess && (
          <button
            onClick={copyToClipboard}
            className={`copy-btn ${copied ? 'copied' : ''}`}
          >
            <span className="copy-icon">{copied ? '✓' : '📋'}</span>
            <span className="copy-text">{copied ? 'COPIED!' : 'COPY TEXT'}</span>
          </button>
        )}
      </div>

      <div className="link" onClick={() => setEnc("U2FtcGxlIGVuY3J5cHRlZCBkYXRhIGZvciBkZW1vbnN0cmF0aW9uLiBUcnkgZGVjcnlwdGluZyB3aXRoIGtleTogJ0lST05NQU4n")}>
        📂 Load Sample Data
      </div>
    </div>
  );
}