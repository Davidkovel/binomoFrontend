import React, { useState, useEffect } from 'react';
import styles from './TradingGlass.module.css';
import { useSelector } from 'react-redux';

import { selectLivePrices, selectSelectedPair } from '../../features/trading/tradingSlice';

const OrderBook = () => {
  const livePrices = useSelector(selectLivePrices);
  const selectedPair = useSelector(selectSelectedPair);
  
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  const currentPrice = livePrices[selectedPair]?.price;
  const baseSymbol = selectedPair.replace('USDT', '');

  // Генерация mock данных для стакана
  const generateOrderBook = (basePrice) => {
    const bids = [];
    const asks = [];

    // Генерация заявок на покупку (bids) - зеленые
    for (let i = 0; i < 12; i++) {
      const price = basePrice - (i * (Math.random() * 50 + 10));
      const amount = (Math.random() * 2 + 0.1).toFixed(4);
      const total = (price * amount).toFixed(2);
      bids.push({ price: price.toFixed(2), amount, total });
    }

    // Генерация заявок на продажу (asks) - красные
    for (let i = 0; i < 12; i++) {
      const price = basePrice + (i * (Math.random() * 50 + 10));
      const amount = (Math.random() * 2 + 0.1).toFixed(4);
      const total = (price * amount).toFixed(2);
      asks.push({ price: price.toFixed(2), amount, total });
    }

    return { bids, asks: asks.reverse() };
  };

  // Обновление стакана каждые 2 секунды
  useEffect(() => {
    const updateOrderBook = () => {
      setOrderBook(generateOrderBook(currentPrice));
    };

    updateOrderBook();
    const interval = setInterval(updateOrderBook, 2000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className={styles.orderBookContainer}>
      <div className={styles.orderBookHeader}>
        <h3>📊 Order Book</h3>
        <div className={styles.spread}>
          Spread: <span>0.01%</span>
        </div>
      </div>

      <div className={styles.orderBookTable}>
        <div className={styles.tableHeader}>
          <span>Price (USDT)</span>
          <span>Amount ({baseSymbol})</span>
          <span>Total</span>
        </div>

        {/* Asks - Заявки на продажу (красные) */}
        <div className={styles.asksSection}>
          {orderBook.asks.map((order, index) => {
            const percentage = (parseFloat(order.amount) / 2) * 100;
            return (
              <div key={`ask-${index}`} className={styles.orderRow}>
                <div 
                  className={styles.depthBar} 
                  style={{ 
                    width: `${percentage}%`,
                    background: 'rgba(239, 68, 68, 0.1)'
                  }}
                />
                <span className={styles.priceAsk}>{order.price}</span>
                <span className={styles.amount}>{order.amount}</span>
                <span className={styles.total}>{order.total}</span>
              </div>
            );
          })}
        </div>

        {/* Current Price */}
        <div className={styles.currentPriceRow}>
          <span className={styles.currentPrice}>
            {currentPrice > 0 ? currentPrice.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
          }) : 'Loading...'}
          </span>
          <span className={styles.priceArrow}>↓</span>
        </div>

        {/* Bids - Заявки на покупку (зеленые) */}
        <div className={styles.bidsSection}>
          {orderBook.bids.map((order, index) => {
            const percentage = (parseFloat(order.amount) / 2) * 100;
            return (
              <div key={`bid-${index}`} className={styles.orderRow}>
                <div 
                  className={styles.depthBar} 
                  style={{ 
                    width: `${percentage}%`,
                    background: 'rgba(16, 185, 129, 0.1)'
                  }}
                />
                <span className={styles.priceBid}>{order.price}</span>
                <span className={styles.amount}>{order.amount}</span>
                <span className={styles.total}>{order.total}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;