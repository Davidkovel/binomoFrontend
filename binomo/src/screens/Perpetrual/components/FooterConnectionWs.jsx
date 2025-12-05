import React, { useState, useEffect } from 'react';

import styles from './FooterConnectionWs.module.css';

// Реальный пример с WebSocket
const FooterConnectionWsReal = () => {
  const [wsStatus, setWsStatus] = useState({
    status: 'Connecting...',
    ping: 0,
    fps: 0,
    isConnected: false
  });

  useEffect(() => {
    let pingInterval;
    let ws;
    let pingStartTime;

    const connectWebSocket = () => {
      ws = new WebSocket('wss://your-websocket-url');

      ws.onopen = () => {
        setWsStatus(prev => ({
          ...prev,
          status: 'Stable',
          isConnected: true
        }));
        
        // Начать измерение ping
        pingInterval = setInterval(() => {
          pingStartTime = Date.now();
          ws.send(JSON.stringify({ type: 'ping' }));
        }, 5000);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'pong') {
          const ping = Date.now() - pingStartTime;
          setWsStatus(prev => ({
            ...prev,
            ping: ping,
            fps: data.fps || 60
          }));
        }
      };

      ws.onerror = (error) => {
        setWsStatus(prev => ({
          ...prev,
          status: 'Error',
          isConnected: false
        }));
      };

      ws.onclose = () => {
        setWsStatus(prev => ({
          ...prev,
          status: 'Disconnected',
          isConnected: false
        }));
        clearInterval(pingInterval);
        
        // Попытка переподключения
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <div className={styles.connectionContainer}>
      <span className={styles.label}>WebSocket: </span>
      <div className={styles.connectionStatus}>
        <div className={`${styles.statusIndicator} ${wsStatus.isConnected ? styles.connected : styles.disconnected}`}>
          <div className={styles.statusDot}></div>
          <span className={styles.statusText}>{wsStatus.status}</span>
        </div>
        <div className={styles.pingContainer}>
          <span className={styles.pingValue}>{wsStatus.ping}</span>
          <span className={styles.pingUnit}>MS</span>
        </div>
        <div className={styles.fpsContainer}>
          <span className={styles.fpsValue}>{wsStatus.fps}</span>
          <span className={styles.fpsUnit}>FP</span>
        </div>
      </div>
    </div>
  );
};

export default FooterConnectionWsReal;