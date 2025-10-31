import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, useContext } from 'react';
import './TradingChart.css';

const saveEntriesToStorage = (entries) => {
  try {
    sessionStorage.setItem('trading_positions', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving positions to localStorage:', error);
  }
};

// Функция для загрузки позиций из localStorage
const loadEntriesFromStorage = () => {
  try {
    const saved = sessionStorage.getItem('trading_positions');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading positions from localStorage:', error);
    return [];
  }
};

export default function TradingChart() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(50000);
  const [entries, setEntries] = useState(loadEntriesFromStorage());
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedPair, setSelectedPair] = useState(() => {
    return sessionStorage.getItem('selectedPair') || 'BTCUSDT';
  });
  //const [initialDeposit, setInitialDeposit] = useState(0);
  const chartContainerRef = useRef(null);
  const widgetRef = useRef(null);

  const tradingPairs = [
    { symbol: 'BTCUSDT', name: 'BTC/USDT', binanceSymbol: 'BTCUSDT' },
    { symbol: 'ETHUSDT', name: 'ETH/USDT', binanceSymbol: 'ETHUSDT' },
    { symbol: 'BNBUSDT', name: 'BNB/USDT', binanceSymbol: 'BNBUSDT' },
    { symbol: 'SOLUSDT', name: 'SOL/USDT', binanceSymbol: 'SOLUSDT' },
    { symbol: 'XRPUSDT', name: 'XRP/USDT', binanceSymbol: 'XRPUSDT' },
    { symbol: 'ADAUSDT', name: 'ADA/USDT', binanceSymbol: 'ADAUSDT' },
  ];

  // Load TradingView script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${selectedPair}`,
      interval: '5',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: 'tradingview_chart',
      support_host: 'https://www.tradingview.com'
    });

    script.onload = () => setIsScriptLoaded(true);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [selectedPair]);


  // Initialize TradingView widget
  useEffect(() => {
    if (!isScriptLoaded || !chartContainerRef.current) return;

    if (widgetRef.current) {
      widgetRef.current.remove();
    }

    const widget = document.createElement('div');
    widget.id = 'tradingview_chart';
    widget.style.width = '100%';
    widget.style.height = '400px';
    
    chartContainerRef.current.appendChild(widget);
    widgetRef.current = widget;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${selectedPair}`,
      interval: '5',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '3',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: false,
      container_id: 'tradingview_chart',
      hide_volume: true,
      support_host: 'https://www.tradingview.com'
    });

    widget.appendChild(script);
  }, [isScriptLoaded, selectedPair]);

  // Fetch real crypto price
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${selectedPair}`);
        const data = await response.json();
        setCurrentPrice(parseFloat(data.price));
      } catch (error) {
        //console.error('Error fetching price:', error);
        const simulatedPrice = 50000 + (Math.random() - 0.5) * 1000;
        setCurrentPrice(simulatedPrice);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, [selectedPair]);

  useEffect(() => {
    saveEntriesToStorage(entries);
  }, [entries]);
  

  
  return (
    <>
      {/* TradingView Chart */}
      <div className="chart-card">
        <h2 className="chart-title">📈 {tradingPairs.find(p => p.symbol === selectedPair)?.name} Grafigi</h2>
        <div 
          ref={chartContainerRef}
          className="tradingview-widget-container"
        >
          {!isScriptLoaded && (
            <div className="chart-loading">
              TradingView grafigi yuklanmoqda...
            </div>
          )}
        </div>
        <div className="chart-footer">
          Grafik TradingView tomonidan ta’minlangan
        </div>
      </div>
    </>
  );
}
