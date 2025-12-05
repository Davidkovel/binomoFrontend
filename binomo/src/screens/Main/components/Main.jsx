// MainScreen.jsx
import React, { useState, useEffect } from 'react';
import './Main.css';

import { useNavigate } from 'react-router-dom';

const MainScreen = () => {
  const navigate = useNavigate(); 
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const stats = [
    { label: 'Total Value Locked', value: '$2.4B+', icon: '🔒' },
    { label: 'Active Users', value: '450K+', icon: '👥' },
    { label: 'Daily Volume', value: '$89M+', icon: '📊' },
    { label: 'Supported Chains', value: '12+', icon: '🌐' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our optimized smart contracts',
      className: 'feature-icon-1'
    },
    {
      icon: '🛡️',
      title: 'Bank-Grade Security',
      description: 'Multi-layer security with audited contracts and insurance coverage',
      className: 'feature-icon-2'
    },
    {
      icon: '📈',
      title: 'Best Rates',
      description: 'AI-powered routing ensures you get the best prices across all DEXs',
      className: 'feature-icon-3'
    }
  ];

  const handleTrade = () => {
    navigate('/trading');
  };

  const handleRegister = () => {
    navigate('/register');
  }

  return (
    <div className="main-screen">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">🚀</div>
          <span className="logo-text">XGeniusDEX</span>
        </div>
        <ul className="nav-links">
          <li><a href="#trade">Trade</a></li>
          <li><a href="#pools">Pools</a></li>
          <li><a href="#stake">Stake</a></li>
          <li><a href="#analytics">Analytics</a></li>
        </ul>
        <button className="btn-connect" onClick={handleRegister}>Connect Wallet</button>
      </nav>

      {/* Hero Section */}
      <div className="container">
        <section className="hero">
          <h1>
            Zero Fee Perpetuals with Privacy
          </h1>
          <p className="hero-description">
            Trade 250+ markets on a super exchange with zero-fees, better-than-CEX liquidity, and institutional-grade privacy, all built on a blazingly fast blockchain.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={handleTrade}>
              Trade on XgeniousDex
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>

          {/* Stats */}
          <div className="stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="features-header">
            <h2>Why Choose <span className="gradient-text">CryptoDEX</span></h2>
            <p>Built for traders who demand the best</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`feature-icon ${feature.className}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className='layer2-info'>
          <h2>A Layer 2 Designed For Extreme Scale (DimeVM)</h2>
          <p>Build without compromise on the fastest and most performant Layer 2 Blockchain in the world</p>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="cta-box">
            <h2>Ready to Start Trading?</h2>
            <p>Join millions of users trading on the most trusted DeFi platform</p>
            <button className="btn-primary" onClick={handleTrade}>
              Launch App Now
              <span>🚀</span>
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <div className="logo-icon">🚀</div>
                <span className="logo-text">CryptoDEX</span>
              </div>
              <p className="footer-description">
                The future of decentralized trading
              </p>
            </div>
            <div className="footer-section">
              <h4>Products</h4>
              <ul>
                <li><a href="#swap">Swap</a></li>
                <li><a href="#liquidity">Liquidity</a></li>
                <li><a href="#staking">Staking</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><a href="#docs">Docs</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#support">Support</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Community</h4>
              <ul>
                <li><a href="#twitter">Twitter</a></li>
                <li><a href="#discord">Discord</a></li>
                <li><a href="#telegram">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 XgeniousDex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainScreen;