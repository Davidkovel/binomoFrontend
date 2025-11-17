import { binanceWebSocket } from './binanceWebsocket';
import {store } from '../store';
import { updateLivePrice } from '../features/trading/tradingSlice';

export const initWebSocket = () => {
  binanceWebSocket.connect();
  
  binanceWebSocket.subscribe((symbol, price) => {
    store.dispatch(updateLivePrice({ symbol, price }));
  });
  
  console.log('✅ WebSocket initialized');
};

export default initWebSocket;