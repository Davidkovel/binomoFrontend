import { createSlice } from '@reduxjs/toolkit';

const tradingUISlice = createSlice({
  name: 'tradingUI',
  initialState: {
    leverage: 10,
    amount: '',
    orderType: 'market',
    limitPrice: '',
    currentPrice: 0,
    selectedPosition: null,
    showCloseModal: false,
  },
  reducers: {
    setLeverage: (state, action) => {
      state.leverage = Math.max(1, Math.min(125, action.payload));
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
    },
    setOrderType: (state, action) => {
      state.orderType = action.payload;
    },
    setLimitPrice: (state, action) => {
      state.limitPrice = action.payload;
    },
    setCurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
    setSelectedPosition: (state, action) => {
      state.selectedPosition = action.payload;
    },
    setShowCloseModal: (state, action) => {
      state.showCloseModal = action.payload;
    },
    resetTradingForm: (state) => {
      state.amount = '';
      state.limitPrice = '';
      state.orderType = 'market';
    },
  },
});

export const {
  setLeverage,
  setAmount,
  setOrderType,
  setLimitPrice,
  setSelectedPosition,
  setCurrentPrice,
  setShowCloseModal,
  resetTradingForm,
} = tradingUISlice.actions;

export default tradingUISlice.reducer;

export const selectTradingUI = (state) => state.tradingUI;
export const selectLeverage = (state) => state.tradingUI.leverage;
export const selectAmount = (state) => state.tradingUI.amount;