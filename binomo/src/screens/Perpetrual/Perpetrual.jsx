import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useAuth } from '../../features/hooks/useAuth'


import PairToolbar from './components/PairToolbar'
import FooterConnectionWs from './components/FooterConnectionWs';
import TradingChart from '../../components/TradingCharts/TradingChart'
import TradingGlass from '../../components/TradingGlass/TradingGlass';
import TradingControls from './components/TradingControl';
import ListActivePositions from './components/ListActivePositions';
import ListHistoryPositions from './components/ListHistoryPositions';
import OpenOrdersTab from './components/OpenOrdersTab';
import initWebSocket from '../../services/websocketsInit';

import styles from './Perpetrual.module.css';

import { selectSelectedPair } from '../../features/trading/tradingSlice';
import { UserContext } from "../../features/context/UserContext"
import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;

const USD_TO_UZS = 13800;
const AI_MULTIPLIER = 34.788559;
const HIGH_MARGIN_MULTIPLIER = 38.2244351;
const PROFIT_AMOUNT = 11537890; // 11 537 890 сум

export default function PerpetrualTradingPlatform() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const selectedPair = useSelector(selectSelectedPair);
  
  const { isAuthenticated, isLoading, logout: authLogout } = useAuth();
  
  const [currentPrice, setCurrentPrice] = useState(50000);
  const [activeTab, setActiveTab] = useState('positions');
  const [activeAccountTab, setActiveAccountTab] = useState('account');

  const hasToken = !!localStorage.getItem('access_token');

  const tabs = [
    'Positions',
    'Open orders',
    'Order history',
    'Trade history',
    'Transaction history',
    'Deposits & withdrawals',
    'Assets'
  ];

  const accountTabs = ['Account', 'Deposit', 'Withdraw', 'Transfer'];

  useEffect(() => {
    initWebSocket();
    
    // Очистка при размонтировании
    return () => {
      // Можно добавить отключение WebSocket если нужно
    };
  }, []);

  useEffect(() => {
    console.log('Trading pair changed to:', selectedPair);
    // Здесь можно обновлять данные графика, ордера и т.д.
  }, [selectedPair]);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${selectedPair}`);
        const data = await response.json();
        setCurrentPrice(parseFloat(data.price));
      } catch (error) {
        //console.error('Error fetching price:', error);
        const simulatedPrice = 50000 + (Math.random() - 0.5) * 1000;
        setCurrentPrice(simulatedPrice);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, [selectedPair]);
  

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.authRequired}>
        <div className={styles.authMessage}>
          <h2>Требуется авторизация</h2>
          <p>Для доступа к торговой платформе необходимо войти в систему</p>
          <button 
            onClick={() => navigate('/login')}
            className={styles.loginButton}
          >
            Войти
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.perpetualContainer}>
      {/* Toolbar сверху - на отдельном уровне */}
      <PairToolbar />

      {/* Grid Layout */}
      <div className={styles.gridLayout}>
        {/* 1. Chart Section */}
        <div className={styles.chartSection}>
          <TradingChart/>
        </div>

        {/* 2. Order Book */}
        <div className={styles.orderBookSection}>
          <TradingGlass/>
        </div>

        {/* 3. Trading Controls */}
        <div className={styles.tradingControlsSection}>
          <TradingControls/>
        </div>

        {/* 4. Bottom Info Section (под графиком и стаканом) */}
        <div className={styles.bottomInfoSection}>
          <div className={styles.tabsHeader}>
            {tabs.map(tab => (
              <button
                key={tab}
                className={activeTab === tab.toLowerCase().replace(/ /g, '-') ? styles.tabActive : styles.tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '-'))}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'positions' && (
              <ListActivePositions />
            )}
            {activeTab === 'open-orders' && (
              <OpenOrdersTab/>
            )}
            {activeTab === 'order-history' && (
              <ListHistoryPositions/>
            )}
          </div>
        </div>

        {/* 5. Account Section (справа снизу) */}
        <div className={styles.accountSection}>
          <div className={styles.accountTabs}>
            {accountTabs.map(tab => (
              <button
                key={tab}
                className={activeAccountTab === tab.toLowerCase() ? styles.accountTabActive : styles.accountTab}
                onClick={() => setActiveAccountTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.accountContent}>
            {activeAccountTab === 'account' && (
              <>
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Account Equity</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountDivider} />
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Spot total value</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Perp total value</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Perp Unrealized PNL</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountDivider} />
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Margin</span>
                </div>
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Account Margin Ratio</span>
                  <span className={styles.accountValue}>0.00%</span>
                </div>
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Account Maintenance Margin</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountItem}>
                  <span className={styles.accountLabel}>Account Equity</span>
                  <span className={styles.accountValue}>--</span>
                </div>
                
                <div className={styles.accountDivider} />
                
                <div className={styles.multiAssetMode}>
                  <span>Multi-Asset Mode</span>
                  <div className={styles.toggle}>
                    <input type="checkbox" id="multiAsset" />
                    <label htmlFor="multiAsset"></label>
                  </div>
                </div>
              </>
            )}

            {activeAccountTab === 'deposit' && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💰</div>
                <p>Deposit functionality</p>
              </div>
            )}

            {activeAccountTab === 'withdraw' && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>💸</div>
                <p>Withdraw functionality</p>
              </div>
            )}

            {activeAccountTab === 'transfer' && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔄</div>
                <p>Transfer functionality</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterConnectionWs></FooterConnectionWs>
    </div>
  );
}