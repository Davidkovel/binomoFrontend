import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';

import { useGetLimitOrdersQuery, useCancelLimitOrderMutation } from '../../../features/trading/tradingApi';

import styles from './OpenOrdersTabs.module.css';

const OpenOrdersTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const { 
    data: ordersData = [], 
    isLoading, 
    error, 
    refetch 
  } = useGetLimitOrdersQuery();

  const [cancelLimitOrder, { isLoading: isCancelling }] = useCancelLimitOrderMutation();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetch();
      }
    };

    const interval = setInterval(() => {
      if (!document.hidden) {
        refetch();
      }
    }, 10000);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetch]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelLimitOrder(orderId).unwrap();
      console.log('Order cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert(`Failed to cancel order: ${err.data?.detail || err.message}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatus = (order) => {
    switch (order.status) {
      case 'Pending':
        return { text: 'Pending', className: styles.statusPending };
      case 'Executed':
        return { text: 'Executed', className: styles.statusExecuted };
      case 'Cancelled':
        return { text: 'Cancelled', className: styles.statusCancelled };
      case 'Expired':
        return { text: 'Expired', className: styles.statusExpired };
      default:
        return { text: order.status, className: styles.statusPending };
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>Error: {error.data?.detail || error.error || 'Failed to load orders'}</p>
          <button 
            className={styles.retryButton}
            onClick={refetch}
            disabled={isLoading}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const orders = Array.isArray(ordersData) ? ordersData : [];

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p>No open orders</p>
          <p className={styles.emptySubtext}>
            Go to the trading page to create a limit order.
          </p>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => order.status === 0); // 0 -> Pending

  if (activeOrders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✅</div>
          <p>There are currently no open orders.</p>
          <p className={styles.emptySubtext}>
            All orders have been fulfilled or canceled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.ordersContainer}>
        <div className={styles.ordersHeader}>
        </div>

        <div className={styles.ordersTable}>
          <div className={styles.tableHeader}>
            <span>Symbol</span>
            <span>Type</span>
            <span>Side</span>
            <span>Limit Price</span>
            <span>Amount</span>
            <span>Leverage</span>
            <span>Status</span>
            <span>Created</span>
            <span>Actions</span>
          </div>

          <div className={styles.tableBody}>
            {activeOrders.map(order => {
              const statusInfo = getOrderStatus(order);
              return (
                <div key={order.id} className={styles.orderRow}>
                  <span className={styles.symbol}>{order.symbol}</span>
                  
                  <span className={order.type === 'Long' ? styles.typeLong : styles.typeShort}>
                    {order.type}
                  </span>
                  
                  <span className={order.side === 'Buy' ? styles.sideBuy : styles.sideSell}>
                    {order.side}
                  </span>
                  
                  <span className={styles.limitPrice}>
                    ${order.limitPrice?.toLocaleString() || 'N/A'}
                  </span>
                  
                  <span className={styles.amount}>
                    {order.amount?.toFixed(2) || 'N/A'}
                  </span>
                  
                  <span className={styles.leverage}>{order.leverage}x</span>
                  
                  <span className={`${styles.status} ${statusInfo.className}`}>
                    {statusInfo.text}
                  </span>
                  
                  <span className={styles.time}>
                    <Clock size={14} />
                    {formatDate(order.createdAt)}
                  </span>
                  
                  <div className={styles.actions}>
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={isCancelling || order.status !== 'Pending'}
                    >
                      <X size={16} />
                      {isCancelling ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenOrdersTab;