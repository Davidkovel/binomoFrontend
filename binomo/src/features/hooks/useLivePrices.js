import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAllPrices, selectTradingPairs } from '../features/trading/tradingSlice';

export const useLivePrices = () => {
  const dispatch = useDispatch();
  const tradingPairs = useSelector(selectTradingPairs);

  useEffect(() => {
    // Функция для генерации случайного изменения цены
    const generatePriceUpdate = (currentPrice, volatility = 0.002) => {
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      return Math.max(0.01, currentPrice + change); // Цена не может быть отрицательной
    };

    // Имитация live данных
    const interval = setInterval(() => {
      const priceUpdates = {};
      
      tradingPairs.forEach(pair => {
        const newPrice = generatePriceUpdate(pair.lastPrice);
        priceUpdates[pair.symbol] = parseFloat(newPrice.toFixed(2));
      });

      dispatch(updateAllPrices(priceUpdates));
    }, 3000); // Обновляем каждые 3 секунды

    return () => clearInterval(interval);
  }, [dispatch, tradingPairs]);

  return null;
};