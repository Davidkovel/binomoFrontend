import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, useContext } from 'react';
import './TradingChart.css';

import { selectSelectedPair, selectLivePrices } from '../../features/trading/tradingSlice'
import { useSelector } from 'react-redux';


export default function TradingChart() {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const selectedPair = useSelector(selectSelectedPair);
  const livePrices = useSelector(selectLivePrices);

  const currentPrice = livePrices[selectedPair]?.price || 0;

  const chartContainerRef = useRef(null);
  const widgetRef = useRef(null);

  // Load TradingView script
  useEffect(() => {
    console.log(selectedPair)
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${selectedPair}`,
      interval: '1',
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
    widget.style.height = '670px';
    
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

  
  return (
    <>
      {/* TradingView Chart */}
      <div className="chart-card">
        {/*<h2 className="chart-title">📈 {tradingPairs.find(p => p.symbol === selectedPair)?.name} Grafigi</h2>*/}
        <div 
          ref={chartContainerRef}
          className="tradingview-widget-container"
        >
          {!isScriptLoaded && (
            <div className="chart-loading">
              TradingView chart is loading...
            </div>
          )}
        </div>
        <div className="chart-footer">
          Chart provided by TradingView
        </div>
      </div>
    </>
  );
}
