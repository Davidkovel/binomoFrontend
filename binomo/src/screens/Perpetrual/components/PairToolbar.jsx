import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ChevronDown, Star, TrendingUp } from 'lucide-react';

import { 
  setSelectedPair, 
  toggleFavorite,
  selectSelectedPair,
  selectFavorites,
  selectTradingPairs,
  selectCurrentPairData 
} from '../../../features/trading/tradingSlice';
import styles from './PairToolbar.module.css';

const PairToolbar = () => {
  const dispatch = useDispatch();
  const selectedPair = useSelector(selectSelectedPair);
  const favorites = useSelector(selectFavorites);
  const tradingPairs = useSelector(selectTradingPairs);
  const currentPairData = useSelector(selectCurrentPairData);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const marketStats = {
    lastPrice: currentPairData.lastPrice,
    change24h: currentPairData.change24h,
    markPrice: currentPairData.lastPrice * 0.9999,
    spotPrice: currentPairData.lastPrice * 1.0001,
    fundingRate: 0.0098,
    volume24h: currentPairData.volume24h,
    openInterest: '1.19B'
  };

  const handlePairChange = (pair) => {
    dispatch(setSelectedPair(pair));
    console.log(pair);
    setIsDropdownOpen(false);
  };

  const toggleFavorite = (symbol) => {
    e.stopPropagation();
    dispatch(toggleFavorite(symbol));
  };

  const filteredPairs = tradingPairs.filter(pair =>
    pair.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPairs = [...filteredPairs].sort((a, b) => {
    const aIsFavorite = favorites.includes(a.symbol);
    const bIsFavorite = favorites.includes(b.symbol);
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return 0;
  });

  return (
    <div className={styles.toolbarContainer}>
      {/* Левая часть - Выбор пары */}
      <div className={styles.pairSelectorSection}>
        <button 
          className={styles.pairButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className={styles.pairName}>{currentPairData.name}</span>
          <ChevronDown 
            className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`} 
            size={20} 
          />
        </button>

        {/* Dropdown с парами */}
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search pairs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            <div className={styles.dropdownContent}>
              <div className={styles.dropdownTable}>
                <div className={styles.tableHeader}>
                  <span>Pair</span>
                  <span>Price</span>
                  <span>Change</span>
                </div>

                {sortedPairs.map(pair => (
                  <div
                    key={pair.symbol}
                    className={`${styles.pairRow} ${selectedPair === pair.symbol ? styles.pairRowActive : ''}`}
                    onClick={() => handlePairChange(pair.symbol)}
                  >
                    <div className={styles.pairInfo}>
                      <button
                        className={styles.favoriteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pair.symbol);
                        }}
                      >
                        <Star
                          size={14}
                          className={favorites.includes(pair.symbol) ? styles.starActive : styles.star}
                          fill={favorites.includes(pair.symbol) ? 'currentColor' : 'none'}
                        />
                      </button>
                      <span className={styles.pairSymbol}>{pair.name}</span>
                    </div>
                    <span className={styles.pairPrice}>
                      ${pair.lastPrice.toLocaleString()}
                    </span>
                    <span className={pair.change24h >= 0 ? styles.changePositive : styles.changeNegative}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Правая часть - Статистика рынка */}
      <div className={styles.marketStatsSection}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Last Price</span>
          <span className={styles.statValue}>
            ${marketStats.lastPrice.toLocaleString()}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>24h Change</span>
          <span className={marketStats.change24h >= 0 ? styles.changePositive : styles.changeNegative}>
            {marketStats.change24h >= 0 ? '+' : ''}{marketStats.change24h}%
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Mark Price</span>
          <span className={styles.statValue}>
            ${marketStats.markPrice.toFixed(1)}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Spot Price</span>
          <span className={styles.statValue}>
            ${marketStats.spotPrice.toFixed(1)}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>8h Funding</span>
          <span className={styles.statValue}>
            {marketStats.fundingRate}%
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>24h Volume</span>
          <span className={styles.statValue}>
            ${marketStats.volume24h}
          </span>
        </div>

        <div className={styles.statItem}>
          <span className={styles.statLabel}>Open Interest</span>
          <span className={styles.statValue}>
            ${marketStats.openInterest}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PairToolbar;