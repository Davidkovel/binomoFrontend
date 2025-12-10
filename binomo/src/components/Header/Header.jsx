import React, { useState, useEffect, useContext } from 'react';
import { Wallet, LogOut, User, Settings, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../modals/PaymentModal';
import styles from './Header.module.css';

import { useAuth } from '../../features/hooks/useAuth'
import { useMeQuery } from '../../features/auth/authApi';
import { UserContext } from "../../features/context/UserContext"

import { CONFIG_API_BASE_URL } from '../../config/constants';

const API_BASE_URL = CONFIG_API_BASE_URL;

const Header = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest');
  const { isAuthenticated, isLoading, setIsAuthenticated, logout: authLogout } = useAuth();
  const [walletAddress, setWalletAddress] = useState('');

  const { userBalance, setUserBalance } = useContext(UserContext);

  // me endpoint
  const { data: userData, error, refetch } = useMeQuery(undefined, {
    skip: !isAuthenticated, // Запрос выполняется только если пользователь аутентифицирован
  });

  const menuNavigation = [
    { name: "Spot", path: "/trading"},
    { name: "Futures", path: "/futures"},
    { name: "Portfolio", path: "/portfolio"},
    { name: "Referral", path: "/referral"},
    { name: "Earn", path: "/staking"},
    { name: "Balance", path: "/balance"},
  ]

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (userData) {
      console.log(userData);
      setUserName(userData.name || 'User');
      setUserBalance(userData.balance || 0);
      
      sessionStorage.setItem('balance', userData.balance?.toString() || '0');
    }
  }, [userData, setUserBalance]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('balance');
    localStorage.removeItem("typePosition");
    sessionStorage.removeItem("selectedPair");
    sessionStorage.removeItem("balance_usd");
    localStorage.removeItem("hasTraded");
    localStorage.removeItem("pendingWithdraw");
    localStorage.removeItem("initial_deposit");
    localStorage.removeItem("refresh_token")

    
    setIsAuthenticated(false);
    setUserBalance(0);
    navigate('/login');
  };

  const handlePage = (path) => {
    navigate(path);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/main');
  }

  const handleDepositClick = () => {
    navigate('/balance');
  };

  const handleConnectWallet = async () => {
    navigate('/register');
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        {/* Logo */}
        <div className={styles.logoSection} onClick={handleHome}>
          <div className={styles.logoIcon}>⚡</div>
          <span className={styles.logoText}>
            <span className={styles.logoMain}>XGenious</span>
            <span className={styles.logoSub}>DEX</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          {menuNavigation.map((item, index) => (
            <button
              key={index}
              className={styles.navItem}
              onClick={() => handlePage(item.path)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className={styles.headerRight}>
          {isAuthenticated ? (
            <>
              {/* User Name */}
              <div className={styles.userInfo}>
                <div className={styles.userIcon}>
                  <User size={16} />
                </div>
                <span className={styles.userName}>{userName}</span>
              </div>

              {/* Balance Display */}
              <div className={styles.balanceContainer}>
                <div className={styles.balanceLabel}>Balance</div>
                <div className={styles.balanceAmount}>
                  ${userBalance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
              </div>

              {/* Wallet Address */}
              <div className={styles.walletInfo}>
                <div className={styles.walletIcon}>
                  <Wallet size={18} />
                </div>
                <span className={styles.walletAddress}>
                  {formatAddress(walletAddress || '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')}
                </span>
              </div>

              {/* Disconnect Button */}
              <button className={styles.disconnectBtn} onClick={handleLogout}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              {/* Connect Wallet Button */}
              <button className={styles.connectWalletBtn} onClick={handleConnectWallet}>
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;