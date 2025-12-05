import React, { useState, useEffect, useRef } from 'react';

export default function FooterConnectionWs() {
  const [wsStatus, setWsStatus] = useState('connecting');
  const [ping, setPing] = useState(0);
  const [fps, setFps] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isMobile, setIsMobile] = useState(false);
  
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(Date.now());
  const animationIdRef = useRef(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simulate WebSocket connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setWsStatus('connected');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Measure FPS
  useEffect(() => {
    const measureFPS = () => {
      frameCountRef.current++;
      const now = Date.now();
      const elapsed = now - lastFrameTimeRef.current;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }

      animationIdRef.current = requestAnimationFrame(measureFPS);
    };

    animationIdRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Simulate ping updates
  useEffect(() => {
    const updatePing = () => {
      if (wsStatus === 'connected') {
        const newPing = Math.floor(Math.random() * 30) + 10; // 10-40ms
        setPing(newPing);
        setLastUpdate(Date.now());
      }
    };

    updatePing();
    const interval = setInterval(updatePing, 2000);

    return () => clearInterval(interval);
  }, [wsStatus]);

  const getStatusColor = () => {
    switch (wsStatus) {
      case 'connected':
        return '#10b981';
      case 'connecting':
        return '#f59e0b';
      case 'disconnected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (wsStatus) {
      case 'connected':
        return 'Active';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={isMobile ? { ...styles.footer, ...styles.footerMobile } : styles.footer}>
      <div style={isMobile ? { ...styles.container, ...styles.containerMobile } : styles.container}>
        {/* Left: Status Indicator */}
        <div style={styles.statusGroup}>
          <div style={styles.statusItem}>
            <div
              style={{
                ...styles.statusDot,
                backgroundColor: getStatusColor(),
                boxShadow: `0 0 8px ${getStatusColor()}`
              }}
            />
            <span style={isMobile ? { ...styles.statusText, fontSize: '11px' } : styles.statusText}>
              {getStatusText()}
            </span>
          </div>

          {wsStatus === 'connected' && !isMobile && (
            <>
              <div style={styles.separator} />
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Ping:</span>
                <span style={styles.metricValue}>{ping}ms</span>
              </div>
            </>
          )}
        </div>

        {/* Right: FPS Counter & Network Info */}
        <div style={styles.rightGroup}>
          <div style={isMobile ? { ...styles.fpsGroup, ...styles.fpsGroupMobile } : styles.fpsGroup}>
            <div style={styles.metricItem}>
              <span style={isMobile ? { ...styles.metricLabel, fontSize: '10px' } : styles.metricLabel}>
                {isMobile ? 'FPS:' : 'FPS:'}
              </span>
              <span
                style={{
                  ...(isMobile ? { ...styles.metricValue, fontSize: '11px' } : styles.metricValue),
                  color: fps >= 55 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444'
                }}
              >
                {fps}
              </span>
            </div>
            
            {!isMobile && (
              <>
                <div style={styles.separator} />
                
                <div style={styles.metricItem}>
                  <span style={styles.metricLabel}>FPS:</span>
                  <span style={styles.metricValue}>
                    {fps > 0 ? Math.round(1000 / fps) : 0}ms
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40px',
    background: 'rgba(10, 10, 15, 0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  footerMobile: {
    height: '36px',
    marginBottom: '10px',
  },
  container: {
    width: '100%',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
  },
  containerMobile: {
    padding: '0 12px',
    gap: '12px',
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '0.3px',
  },
  separator: {
    width: '1px',
    height: '16px',
    background: 'rgba(255, 255, 255, 0.15)',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: 500,
  },
  metricValue: {
    fontSize: '13px',
    color: '#fff',
    fontWeight: 600,
    fontFamily: 'Monaco, "Courier New", monospace',
  },
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  fpsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '6px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  fpsGroupMobile: {
    padding: '4px 12px',
    gap: '8px',
  },
  networkInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  infoIcon: {
    fontSize: '14px',
  },
  infoText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: 500,
  },
};

// Add keyframes for pulse animation
const styleSheet = document.styleSheets[0];
const keyframes = `
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
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Ignore if rule already exists
}