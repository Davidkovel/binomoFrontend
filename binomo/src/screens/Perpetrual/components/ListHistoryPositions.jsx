import React, { useState, useEffect } from 'react';
 
import { useGetHistoryPositionsQuery } from '../../../features/trading/tradingApi';
import PositionHistoryModal from '../../../components/modals/PositionCardModel';

import styles from './ListHistoryPositions.module.css';

const ListHistoryPositions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const {
    data: positions = [],
    isLoading,
    error,
    refetch,
  } = useGetHistoryPositionsQuery({ page: currentPage, pageSize });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading position history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>Error: {error.data?.detail || error.error || 'Failed to load history'}</p>
          <button 
            className={styles.retryButton}
            onClick={refetch}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!positions || positions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📜</div>
          <p>No position history found</p>
          <span className={styles.emptySubtitle}>
            Your closed positions will appear here
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Position History</h3>
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>Page {currentPage}</span>
          <button
            className={styles.pageButton}
            disabled={positions.length < pageSize}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next →
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>Size</th>
              <th>Leverage</th>
              <th>P/L</th>
              <th>ROI</th>
              <th>Close Reason</th>
              <th>Closed At</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id} className={styles.tableRow} onClick={() => setSelectedPosition(position)}>
                <td className={styles.symbolCell}>
                  <span className={styles.symbol}>{position.symbol}</span>
                </td>
                <td>
                  <span className={position.type === 'Long' ? styles.long : styles.short}>
                    {position.type}
                  </span>
                </td>
                <td className={styles.priceCell}>
                  {formatCurrency(position.entryPrice)}
                </td>
                <td className={styles.priceCell}>
                  {position.exitPrice ? formatCurrency(position.exitPrice) : '--'}
                </td>
                <td className={styles.amountCell}>
                  {position.amount.toFixed(4)}
                </td>
                <td className={styles.leverageCell}>
                  {position.leverage}x
                </td>
                <td className={styles.plCell}>
                  <span className={position.profitLoss >= 0 ? styles.profit : styles.loss}>
                    {formatCurrency(position.profitLoss)}
                  </span>
                </td>
                <td className={styles.roiCell}>
                  <span className={position.roi >= 0 ? styles.profit : styles.loss}>
                    {formatPercentage(position.roi)}
                  </span>
                </td>
                <td className={styles.reasonCell}>
                  {position.closeReason || 'Manual Close'}
                </td>
                <td className={styles.dateCell}>
                  {formatDate(position.closedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPosition && (
        <PositionHistoryModal
          position={selectedPosition}
          onClose={() => setSelectedPosition(null)}
          formatCurrency={formatCurrency}
          formatPercentage={formatPercentage}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default ListHistoryPositions;