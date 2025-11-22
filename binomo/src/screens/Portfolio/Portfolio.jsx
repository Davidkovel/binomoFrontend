import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, PieChart as PieIcon, History, Download } from 'lucide-react';
import styles from './Portfolio.module.css';

const Portfolio = () => {
  const [timeRange, setTimeRange] = useState('7D');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - заменить на реальный API вызов
  useEffect(() => {
    fetchPortfolioData();
  }, [timeRange]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    // Здесь будет реальный API вызов
    // const response = await fetch(`/api/portfolio?range=${timeRange}`);
    // const data = await response.json();
    
    // Mock данные
    setTimeout(() => {
      setPortfolioData(mockPortfolioData);
      setLoading(false);
    }, 500);
  };

  const mockPortfolioData = {
    totalBalance: 125430.50,
    totalBalanceChange: 12.5,
    totalPnL: 8234.20,
    totalPnLChange: 15.3,
    volume7d: 234567.89,
    volumeChange: -3.2,
    totalTrades: 156,
    winRate: 68.5,
    
    balanceHistory: [
      { date: '2024-01-01', balance: 100000, pnl: 0 },
      { date: '2024-01-02', balance: 102000, pnl: 2000 },
      { date: '2024-01-03', balance: 105000, pnl: 5000 },
      { date: '2024-01-04', balance: 103000, pnl: 3000 },
      { date: '2024-01-05', balance: 108000, pnl: 8000 },
      { date: '2024-01-06', balance: 115000, pnl: 15000 },
      { date: '2024-01-07', balance: 125430.50, pnl: 25430.50 }
    ],
    
    assetAllocation: [
      { name: 'BTC', value: 45, amount: 56443.73 },
      { name: 'ETH', value: 30, amount: 37629.15 },
      { name: 'SOL', value: 15, amount: 18814.58 },
      { name: 'USDT', value: 10, amount: 12543.05 }
    ],
    
    recentPositions: [
      {
        id: 1,
        symbol: 'BTCUSDT',
        type: 'Long',
        entryPrice: 95000,
        exitPrice: 98000,
        amount: 0.5,
        pnl: 1500,
        roi: 15.79,
        closedAt: '2024-01-07 14:23',
        status: 'Closed'
      },
      {
        id: 2,
        symbol: 'ETHUSDT',
        type: 'Short',
        entryPrice: 3900,
        exitPrice: 3850,
        amount: 2,
        pnl: 100,
        roi: 2.56,
        closedAt: '2024-01-07 12:15',
        status: 'Closed'
      },
      {
        id: 3,
        symbol: 'SOLUSDT',
        type: 'Long',
        entryPrice: 230,
        currentPrice: 234,
        amount: 10,
        pnl: 40,
        roi: 1.74,
        status: 'Open'
      }
    ],
    
    performanceStats: {
      bestTrade: { symbol: 'BTCUSDT', pnl: 3450, roi: 28.5 },
      worstTrade: { symbol: 'XRPUSDT', pnl: -850, roi: -12.3 },
      avgWin: 1234,
      avgLoss: -567,
      totalFees: 234.56
    }
  };

  const COLORS = ['#22d3ee', '#a855f7', '#ec4899', '#10b981'];

  const StatCard = ({ icon: Icon, title, value, change, isPositive }) => (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>
        <Icon size={24} />
      </div>
      <div className={styles.statContent}>
        <span className={styles.statLabel}>{title}</span>
        <div className={styles.statValueRow}>
          <span className={styles.statValue}>{value}</span>
          {change !== undefined && (
            <span className={isPositive ? styles.changePositive : styles.changeNegative}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className={styles.portfolioContainer}>
      <div className={styles.portfolioHeader}>
        <div>
          <h1 className={styles.title}>Portfolio</h1>
          <p className={styles.subtitle}>Track your trading performance</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.timeRangeSelector}>
            {['24H', '7D', '30D', '90D', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                className={timeRange === range ? styles.timeRangeActive : styles.timeRangeBtn}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className={styles.exportBtn}>
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <StatCard
          icon={DollarSign}
          title="Total Balance"
          value={`$${portfolioData.totalBalance.toLocaleString()}`}
          change={portfolioData.totalBalanceChange}
          isPositive={portfolioData.totalBalanceChange > 0}
        />
        <StatCard
          icon={TrendingUp}
          title="Total PnL (7D)"
          value={`$${portfolioData.totalPnL.toLocaleString()}`}
          change={portfolioData.totalPnLChange}
          isPositive={portfolioData.totalPnL > 0}
        />
        <StatCard
          icon={Activity}
          title="Volume (7D)"
          value={`$${portfolioData.volume7d.toLocaleString()}`}
          change={portfolioData.volumeChange}
          isPositive={portfolioData.volumeChange > 0}
        />
        <StatCard
          icon={History}
          title="Win Rate"
          value={`${portfolioData.winRate}%`}
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Balance History Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Balance History</h3>
            <span className={styles.chartSubtitle}>Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={portfolioData.balanceHistory}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#colorBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Allocation */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Asset Allocation</h3>
            <span className={styles.chartSubtitle}>Current distribution</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData.assetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {portfolioData.assetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name, props) => [
                  `$${props.payload.amount.toLocaleString()}`,
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieChartLegend}>
            {portfolioData.assetAllocation.map((asset, index) => (
              <div key={asset.name} className={styles.legendItem}>
                <div 
                  className={styles.legendColor} 
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className={styles.legendName}>{asset.name}</span>
                <span className={styles.legendValue}>{asset.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className={styles.performanceSection}>
        <h3 className={styles.sectionTitle}>Performance Statistics</h3>
        <div className={styles.performanceGrid}>
          <div className={styles.performanceCard}>
            <span className={styles.performanceLabel}>Best Trade</span>
            <span className={styles.performanceValue}>
              {portfolioData.performanceStats.bestTrade.symbol}
            </span>
            <span className={styles.performancePnl}>
              +${portfolioData.performanceStats.bestTrade.pnl} (+{portfolioData.performanceStats.bestTrade.roi}%)
            </span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.performanceLabel}>Worst Trade</span>
            <span className={styles.performanceValue}>
              {portfolioData.performanceStats.worstTrade.symbol}
            </span>
            <span className={styles.performanceLoss}>
              ${portfolioData.performanceStats.worstTrade.pnl} ({portfolioData.performanceStats.worstTrade.roi}%)
            </span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.performanceLabel}>Avg Win</span>
            <span className={styles.performancePnl}>
              +${portfolioData.performanceStats.avgWin}
            </span>
          </div>
          <div className={styles.performanceCard}>
            <span className={styles.performanceLabel}>Avg Loss</span>
            <span className={styles.performanceLoss}>
              ${portfolioData.performanceStats.avgLoss}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Positions */}
      <div className={styles.positionsSection}>
        <h3 className={styles.sectionTitle}>Recent Positions</h3>
        <div className={styles.positionsTable}>
          <div className={styles.tableHeader}>
            <span>Symbol</span>
            <span>Type</span>
            <span>Entry</span>
            <span>Exit/Current</span>
            <span>Amount</span>
            <span>PnL</span>
            <span>ROI</span>
            <span>Status</span>
          </div>
          {portfolioData.recentPositions.map((position) => (
            <div key={position.id} className={styles.tableRow}>
              <span className={styles.symbolCell}>{position.symbol}</span>
              <span className={position.type === 'Long' ? styles.typeLong : styles.typeShort}>
                {position.type}
              </span>
              <span>${position.entryPrice.toLocaleString()}</span>
              <span>
                ${(position.exitPrice || position.currentPrice).toLocaleString()}
              </span>
              <span>{position.amount}</span>
              <span className={position.pnl >= 0 ? styles.pnlPositive : styles.pnlNegative}>
                {position.pnl >= 0 ? '+' : ''}${position.pnl}
              </span>
              <span className={position.roi >= 0 ? styles.pnlPositive : styles.pnlNegative}>
                {position.roi >= 0 ? '+' : ''}{position.roi}%
              </span>
              <span className={position.status === 'Open' ? styles.statusOpen : styles.statusClosed}>
                {position.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;