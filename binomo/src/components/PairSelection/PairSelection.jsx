import React, { useState, useEffect, useContext } from 'react';

const PairSelection = () => {
    const [selectedPair, setSelectedPair] = useState(() => {
        return sessionStorage.getItem('selectedPair') || 'BTCUSDT';
    });

    const tradingPairs = [
        { symbol: 'BTCUSDT', name: 'BTC/USDT', binanceSymbol: 'BTCUSDT' },
        { symbol: 'ETHUSDT', name: 'ETH/USDT', binanceSymbol: 'ETHUSDT' },
        { symbol: 'BNBUSDT', name: 'BNB/USDT', binanceSymbol: 'BNBUSDT' },
        { symbol: 'SOLUSDT', name: 'SOL/USDT', binanceSymbol: 'SOLUSDT' },
        { symbol: 'XRPUSDT', name: 'XRP/USDT', binanceSymbol: 'XRPUSDT' },
        { symbol: 'ADAUSDT', name: 'ADA/USDT', binanceSymbol: 'ADAUSDT' },
    ];

    const handlePairChange = (pair) => {
        const savedPositions = sessionStorage.getItem('trading_positions');
        const positions = savedPositions ? JSON.parse(savedPositions) : [];
        if (positions.length > 0) {
            alert("💼 Faol pozitsiyalar mavjud — biz hozirgi sahifada qolamiz, pozitsiyalar yopilgach boshqa juftliklarga o‘tishingiz mumkin");
        }
        else{
            setSelectedPair(pair);
            sessionStorage.setItem('selectedPair', pair);
        }
    };
    
    return (
        <>
        {/* Pair Selector */}
        <div className="pair-selector-card">
            <h3 className="pair-selector-title">Savdo juftligini tanlang</h3>
            <div className="pair-buttons">
            {tradingPairs.map(pair => (
                <button
                key={pair.symbol}
                onClick={() => handlePairChange(pair.symbol)}
                className={`pair-btn ${selectedPair === pair.symbol ? 'active' : ''}`}
                >
                {pair.name}
                </button>
            ))}
            </div>
        </div>
    </>
    );
};

export default PairSelection;