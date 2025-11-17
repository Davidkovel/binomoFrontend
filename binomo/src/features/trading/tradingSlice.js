// src/features/trading/tradingSlice.js
import { createSlice } from '@reduxjs/toolkit';

import { binanceWebSocket } from '../../services/binanceWebsocket';


const tradingSlice = createSlice({
  name: 'trading',
  initialState: {
    selectedPair: sessionStorage.getItem('selectedPair') || 'BTCUSDT',
    favorites: JSON.parse(localStorage.getItem('favoritePairs')) || ['BTCUSDT', 'ETHUSDT'],
    livePrices: {},
    tradingPairs: [
      { 
        symbol: 'BTCUSDT', 
        name: 'BTC/USDT', 
        binanceSymbol: 'BTCUSDT',
        lastPrice: 103560.8,
        change24h: 1.63,
        volume24h: '423.14M'
      },
      { 
        symbol: 'ETHUSDT', 
        name: 'ETH/USDT', 
        binanceSymbol: 'ETHUSDT',
        lastPrice: 3891.23,
        change24h: 2.45,
        volume24h: '198.76M'
      },
      { 
        symbol: 'BNBUSDT', 
        name: 'BNB/USDT', 
        binanceSymbol: 'BNBUSDT',
        lastPrice: 612.45,
        change24h: -0.87,
        volume24h: '87.32M'
      },
      { 
        symbol: 'SOLUSDT', 
        name: 'SOL/USDT', 
        binanceSymbol: 'SOLUSDT',
        lastPrice: 234.56,
        change24h: 5.23,
        volume24h: '156.89M'
      },
      { 
        symbol: 'XRPUSDT', 
        name: 'XRP/USDT', 
        binanceSymbol: 'XRPUSDT',
        lastPrice: 2.34,
        change24h: -1.23,
        volume24h: '234.56M'
      },
      { 
        symbol: 'ADAUSDT', 
        name: 'ADA/USDT', 
        binanceSymbol: 'ADAUSDT',
        lastPrice: 1.12,
        change24h: 3.45,
        volume24h: '89.23M'
      },
    ]
  },
  reducers: {
      updateLivePrice: (state, action) => {
        const { symbol, price } = action.payload;
        
        const pair = state.tradingPairs.find(p => p.symbol === symbol);
        if (pair) {
            const change = ((price - pair.lastPrice) / pair.lastPrice) * 100;
            pair.lastPrice = price;
            pair.change24h = change;
        }
        
        state.livePrices[symbol] = {
            price,
            timestamp: Date.now()
        };
    },
    setSelectedPair: (state, action) => {
      const savedPositions = sessionStorage.getItem('trading_positions');
      const positions = savedPositions ? JSON.parse(savedPositions) : [];
      
      if (positions.length > 0) {
        alert("💼 Faol pozitsiyalar mavjud — pozitsiyalar yopilgach boshqa juftliklarga o'tishingiz mumkin");
        return;
      }
      
      state.selectedPair = action.payload;
      console.log('selected pair', action.payload, state.selectedPair)
      sessionStorage.setItem('selectedPair', action.payload);
    },
    
    toggleFavorite: (state, action) => {
      const symbol = action.payload;
      if (state.favorites.includes(symbol)) {
        state.favorites = state.favorites.filter(s => s !== symbol);
      } else {
        state.favorites.push(symbol);
      }

      localStorage.setItem('favoritePairs', JSON.stringify(state.favorites));
    },
    
    updatePairPrice: (state, action) => {
      const { symbol, lastPrice, change24h } = action.payload;
      const pair = state.tradingPairs.find(p => p.symbol === symbol);
      if (pair) {
        pair.lastPrice = lastPrice;
        pair.change24h = change24h;
      }
    }
  },
});

export const { 
  setSelectedPair, 
  toggleFavorite, 
  updatePairPrice,
  updateLivePrice,
} = tradingSlice.actions;

// Селекторы
export const selectSelectedPair = (state) => state.trading.selectedPair;
export const selectFavorites = (state) => state.trading.favorites;
export const selectTradingPairs = (state) => state.trading.tradingPairs;
export const selectCurrentPairData = (state) => 
  state.trading.tradingPairs.find(p => p.symbol === state.trading.selectedPair) || state.trading.tradingPairs[0];

export const selectLivePrices = (state) => state.trading.livePrices || {};

export default tradingSlice.reducer;