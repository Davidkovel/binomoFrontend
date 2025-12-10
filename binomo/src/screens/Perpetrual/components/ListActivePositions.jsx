import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetActivePositionsQuery, 
  useClosePositionMutation 
} from '../../../features/trading/tradingApi';
import { selectLivePrices, selectSelectedPair } from '../../../features/trading/tradingSlice';

import styles from './ListActivePositions.module.css';

const ListActivePositions = () => {
  const livePrices = useSelector(selectLivePrices);
  const selectedPair = useSelector(selectSelectedPair);
  const [livePnLData, setLivePnLData] = useState({});

  const currentPrice = livePrices[selectedPair]?.price;

  const { 
    data: positions = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetActivePositionsQuery();

  const [closePosition, { isLoading: isClosing }] = useClosePositionMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (positions.length === 0 || Object.keys(livePrices).length === 0) return;

    const newLivePnLData = {};

    positions.forEach(position => {
      const currentLivePrice = livePrices[position.symbol]?.price;

      if (currentLivePrice) {
        const qty = position.amount / position.entryPrice;

        let unrealizedPnL = 0;
        let unrealizedPnLPercentage = 0;

        if (position.type === 1) { // LONG
          unrealizedPnL = (currentLivePrice - position.entryPrice) * qty;
          unrealizedPnLPercentage = ((currentLivePrice - position.entryPrice) / position.entryPrice) * 100;
        } else { // SHORT
          unrealizedPnL = (position.entryPrice - currentLivePrice) * qty;
          unrealizedPnLPercentage = ((position.entryPrice - currentLivePrice) / position.entryPrice) * 100;
        }

        newLivePnLData[position.id] = {
          currentPrice: currentLivePrice,
          unrealizedPnL,
          unrealizedPnLPercentage,
          timestamp: Date.now()
        };
      }
    });

    setLivePnLData(newLivePnLData);
    
  }, [positions, livePrices]);

  const handleClosePosition = async (positionId, symbol) => {
    if (!confirm(`Are you really sure you want to close the ${symbol} position?`)) {
      return;
    }

    if (isClosing) return; 

    try {
      console.log(`CLOSING POSITION BODY: ${positionId}, ${currentPrice}`)
      const result = await closePosition({
        PositionId: positionId,
        CurrentPrice: currentPrice
      }).unwrap();
      
      console.log('Position closed successfully:', result);
      alert('Position closed successfully!');
      
    } catch (error) {
      console.error('Failed to close position:', error);
      const errorMessage = error.data?.detail || error.message || 'Error occured';
      alert(`Error: ${errorMessage}`);
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0.00';
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: Math.abs(price) < 1 ? 4 : 2
    }).format(price);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return '0.00%';
    
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getPnLColor = (pnl, previousPnL) => {
    if (pnl > 0) return styles.profit;
    if (pnl < 0) return styles.loss;
    return styles.neutral;
  };

  const getPnLAnimation = (currentPnL, previousPnL, positionId) => {
    if (!previousPnL || currentPnL === previousPnL) return '';
    
    if (currentPnL > previousPnL) return styles.pulseGreen;
    if (currentPnL < previousPnL) return styles.pulseRed;
    
    return '';
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Positions are loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>An error occurred: {error.data?.detail || error.message}</p>
        <button onClick={refetch} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📊</div>
        <p>You currently have no open positions.</p>
        <p className={styles.emptySubtext}>
          Click the Long or Short button above to start trading.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.positionsContainer}>
      <div className={styles.positionsHeader}>
        <h3>Active Positions</h3>
        <div className={styles.headerInfo}>
          <span className={styles.positionsCount}>{positions.length} ta</span>
        </div>
      </div>

      <div className={styles.positionsList}>
        {positions.map((position) => {
          const liveData = livePnLData[position.id];
          const currentPrice = liveData?.currentPrice || position.currentPrice;
          const unrealizedPnL = liveData?.unrealizedPnL ?? position.profitLoss;
          const unrealizedPnLPercentage = liveData?.unrealizedPnLPercentage ?? position.profitLossPercentage;
          
          const isProfit = unrealizedPnL >= 0;
          const isLong = position.type === 1;
          const hasLiveData = !!liveData;
          
          return (
            <div key={position.id} className={`${styles.positionCard} ${hasLiveData ? styles.live : ''}`}>
              {/* Header */}
              <div className={styles.positionHeader}>
                <div className={styles.symbolInfo}>
                  <span className={styles.symbol}>{position.symbol}</span>
                  <span className={isLong ? styles.longBadge : styles.shortBadge}>
                    {isLong ? 'LONG' : 'SHORT'}
                  </span>
                </div>
                <button
                  onClick={() => handleClosePosition(position.id, position.symbol)}
                  disabled={isClosing}
                  className={styles.closeButton}
                >
                  {isClosing ? '...' : '✕'}
                </button>
              </div>
            
              {/* Основная информация */}
              <div className={styles.positionBody}>
                <div className={styles.priceInfo}>
                  <div className={styles.priceRow}>
                    <span>Admission price:</span>
                    <span>${formatPrice(position.entryPrice)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Current price:</span>
                    <span className={`${styles.currentPrice} ${isProfit ? styles.profit : styles.loss}`}>
                      ${formatPrice(currentPrice)}
                    </span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Leverage:</span>
                    <span>{position.leverage}x</span>
                  </div>
                </div>

                <div className={styles.amountInfo}>
                  <div className={styles.amountRow}>
                    <span>Quantity:</span>
                    <span>{formatPrice(position.amount)}</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>Margin:</span>
                    <span>${formatPrice(position.margin)}</span>
                  </div>
                  <div className={styles.amountRow}>
                    <span>P&L:</span>
                    <span className={`${isProfit ? styles.profit : styles.loss} ${styles.pnlValue}`}>
                      {isProfit ? '+' : ''}{formatPrice(unrealizedPnL)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className={styles.positionFooter}>
                <div className={styles.additionalInfo}>
                  <div className={styles.infoItem}>
                    <span>P&L %:</span>
                    <span className={`${isProfit ? styles.profit : styles.loss} ${styles.percentageValue}`}>
                      {formatPercentage(unrealizedPnLPercentage)}
                    </span>
                  </div>
                  
                  {/* Liquidation Price расчет */}
                  <div className={styles.infoItem}>
                    <span>Liquidation:</span>
                    <span className={styles.warning}>
                      ${formatPrice(
                        isLong 
                          ? position.entryPrice * (1 - 0.9 / position.leverage)
                          : position.entryPrice * (1 + 0.9 / position.leverage)
                      )}
                    </span>
                  </div>

                  {position.stopLoss > 0 && (
                    <div className={styles.infoItem}>
                      <span>Stop Loss:</span>
                      <span>${formatPrice(position.stopLoss)}</span>
                    </div>
                  )}
                  {position.takeProfit > 0 && (
                    <div className={styles.infoItem}>
                      <span>Take Profit:</span>
                      <span>${formatPrice(position.takeProfit)}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.timeInfo}>
                  <span>
                    {new Date(position.createdAt).toLocaleDateString()} |{' '}
                    {new Date(position.createdAt).toLocaleTimeString()}
                    {hasLiveData && ' • Live'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListActivePositions;