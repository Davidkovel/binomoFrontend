import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useOpenPositionMutation, useOpenLimitOrderMutation } from '../../../features/trading/tradingApi';
import { selectSelectedPair } from '../../../features/trading/tradingSlice';
import { selectLivePrices } from '../../../features/trading/tradingSlice';


import styles from './TradingControl.module.css';

const TradingControl = () => {
    const dispatch = useDispatch();
    const selectedPair = useSelector(selectSelectedPair);
    const livePrices = useSelector(selectLivePrices);

    const [leverage, setLeverage] = useState(10);
    const [amount, setAmount] = useState('');
    const [orderType, setOrderType] = useState('market'); // market или limit
    const [limitPrice, setLimitPrice] = useState('');

    const [openPosition, { isLoading: isOpening }] = useOpenPositionMutation();
    const [openLimitOrder, { isLoading: isOpeningLimit }] = useOpenLimitOrderMutation();

    const leverageOptions = [1, 2, 5, 10, 25, 50, 75, 100, 125];
    
    const currentPrice = livePrices[selectedPair]?.price;

    const calculateLiquidationPrice = (type, entryPrice, leverage) => {
        if (!entryPrice || !leverage) return 0;
        
        const leverageRatio = 1 / leverage;
        
        if (type === 'Long') {
            // Для лонга: entryPrice * (1 - 1/leverage)
            return entryPrice * (1 - leverageRatio);
        } else {
            // Для шорта: entryPrice * (1 + 1/leverage)
            return entryPrice * (1 + leverageRatio);
        }
    };

    const liquidationPriceLong = currentPrice ? 
        calculateLiquidationPrice('Long', currentPrice, leverage) : 0;

    const liquidationPriceShort = currentPrice ? 
        calculateLiquidationPrice('Short', currentPrice, leverage) : 0;

    const handleLeverageChange = (value) => {
        setLeverage(Math.max(1, Math.min(1000, value)));
    };

    const handleLongTrade = async () => {
        await executeTrade('Long');
    };

    const handleShortTrade = async () => {
        await executeTrade('Short');
    };

    const executeTrade = async (type) => {
        if (!amount || parseFloat(amount) <= 0) {
            alert('Iltimos, miqdorni kiriting');
            return;
        }

        // Для лимитных ордеров проверяем limitPrice
        if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
            alert('Iltimos, limit narxini kiriting');
            return;
        }

        try {
            const entryPrice = orderType === 'market' ? currentPrice : (limitPrice || currentPrice);
            const liqPrice = calculateLiquidationPrice(type, entryPrice, leverage);

            if (orderType === 'market') {
                // MARKET ORDER
                const positionData = {
                    symbol: selectedPair,
                    type: type === 'Long' ? 1 : 2, // 1 для Long, 2 для Short
                    amount: parseFloat(amount),
                    leverage: leverage,
                    orderType: 1, // 1 = Market
                    currentPrice: currentPrice,
                    limitPrice: null,
                    stopLoss: null,
                    takeProfit: null,
                    liquidationPrice: liqPrice
                };

                const result = await openPosition(positionData).unwrap();
                console.log(`${type} market position opened:`, result);
                alert(`Market pozitsiya muvaffaqiyatli ochildi!`);
                
            } else {
                // LIMIT ORDER
                const limitOrderData = {
                    symbol: selectedPair,
                    type: type === 'Long' ? 1 : 2, // 1 для Long, 2 для Short
                    side: type === 'Long' ? 1 : 2, // 1 для Buy, 2 для Sell
                    limitPrice: parseFloat(limitPrice),
                    amount: parseFloat(amount),
                    margin: parseFloat(amount) / leverage, // Рассчитываем маржу
                    leverage: leverage,
                    stopLoss: null,
                    takeProfit: null
                };

                const result = await openLimitOrder(limitOrderData).unwrap();
                console.log(`${type} limit order created:`, result);
                alert(`Limit order muvaffaqiyatli yaratildi!`);
            }
            
            setAmount('');
            setLimitPrice('');
            
        } catch (error) {
            console.error('Trade error:', error);
            
            const errorMessage = error.data?.detail || error.message || 'Noma\'lum xatolik';
            alert(`Xatolik: ${errorMessage}`);
        }
    };

    const handlePercentageClick = (percent) => {
        console.log(`Selected ${percent}% of balance`);
    };


    return (
        <div className={styles.tradingControlsSection}>
            <div className={styles.controlsHeader}>
                <h3>⚡ Savdo</h3>
            </div>
    
            {/* Order Type Selector */}
            <div className={styles.orderTypeSelector}>
                <button 
                    className={orderType === 'market' ? styles.orderTypeActive : styles.orderTypeBtn}
                    onClick={() => setOrderType('market')}
                >
                    Market
                </button>
                <button 
                    className={orderType === 'limit' ? styles.orderTypeActive : styles.orderTypeBtn}
                    onClick={() => setOrderType('limit')}
                >
                    Limit
                </button>
            </div>
    
            {/* Leverage Slider */}
            <div className={styles.leverageSection}>
                <div className={styles.leverageHeader}>
                    <span>Leverage</span>
                    <span className={styles.leverageValue}>{leverage}x</span>
                </div>
                
                <input
                    type="range"
                    min="1"
                    max="1000"
                    value={leverage}
                    onChange={(e) => handleLeverageChange(parseInt(e.target.value))}
                    className={styles.leverageSlider}
                />
    
                <div className={styles.leverageQuickButtons}>
                    {leverageOptions.map((lev) => (
                        <button
                            key={lev}
                            onClick={() => setLeverage(lev)}
                            className={leverage === lev ? styles.leverageQuickActive : styles.leverageQuickBtn}
                        >
                            {lev}x
                        </button>
                    ))}
                </div>
            </div>
    
            {/* Price Input (for limit orders) */}
            {orderType === 'limit' && (
                <div className={styles.inputGroup}>
                    <label>Narx</label>
                    <div className={styles.inputWrapper}>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            className={styles.input}
                        />
                        <span className={styles.inputSuffix}>USDT</span>
                    </div>
                </div>
            )}
    
            {/* Amount Input */}
            <div className={styles.inputGroup}>
                <label>Miqdor</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={styles.input}
                    />
                    <span className={styles.inputSuffix}>USDT</span>
                </div>
            </div>
    
            {/* Amount Percentage Buttons */}
            <div className={styles.percentageButtons}>
                {[25, 50, 75, 100, 125].map((percent) => (
                    <button 
                        key={percent} 
                        className={styles.percentBtn}
                        onClick={() => handlePercentageClick(percent)}
                    >
                        {percent}%
                    </button>
                ))}
            </div>
    
            {/* Long/Short Buttons */}
            <div className={styles.tradeButtons}>
                <button 
                    className={styles.btnLong}
                    onClick={handleLongTrade}
                    disabled={isOpening || !amount || parseFloat(amount) <= 0}
                >
                    <span className={styles.btnIcon}>📈</span>
                    <span>
                        {isOpening ? 'Yuklanmoqda...' : 'Long / Sotib olish'}
                    </span>
                </button>
                <button 
                    className={styles.btnShort}
                    onClick={handleShortTrade}
                    disabled={isOpening || !amount || parseFloat(amount) <= 0}
                >
                    <span className={styles.btnIcon}>📉</span>
                    <span>
                        {isOpening ? 'Yuklanmoqda...' : 'Short / Sotish'}
                    </span>
                </button>
            </div>
    
            {/* Расчет маржи и ликвидации */}
            <div className={styles.marginInfo}>
                <div className={styles.marginRow}>
                    <span>Margin:</span>
                    <span>{(amount / leverage || 0).toFixed(2)} USDT</span>
                </div>
                <div className={styles.marginRow}>
                    <span>Pozitsiya hajmi:</span>
                    <span>{(amount * leverage || 0).toFixed(2)} USDT</span>
                </div>
                <div className={styles.marginRow}>
                    <span>Liquidation:</span>
                    <span>
                        {liquidationPriceLong.toFixed(4)} / {liquidationPriceShort.toFixed(4)}
                    </span>
                </div>
            </div>
    
            {/* Risk Warning */}
            <div className={styles.riskWarning}>
                ⚠️ Yuqori leverage xavfli! Ehtiyot bo'ling.
            </div>
        </div>
    );
};

export default TradingControl;