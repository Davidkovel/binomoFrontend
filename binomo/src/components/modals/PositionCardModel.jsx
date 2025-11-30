import React from "react";
import styles from "./PositionCardModal.module.css";


const PositionHistoryModal = ({
  position,
  onClose,
  formatCurrency,
  formatPercentage,
  formatDate
}) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <h2 className={styles.title}>{position.symbol} Futures</h2>

        <div className={styles.side}>
          <span className={position.type === "Long" ? styles.long : styles.short}>
            {position.type} | {position.leverage}x
          </span>
        </div>

        <div className={styles.infoBlock}>
          <div className={styles.row}>
            <span>Entry Price</span>
            <strong>{formatCurrency(position.entryPrice)}</strong>
          </div>

          <div className={styles.row}>
            <span>Exit Price</span>
            <strong>{formatCurrency(position.exitPrice)}</strong>
          </div>

          <div className={styles.row}>
            <span>Size</span>
            <strong>{position.amount.toFixed(4)}</strong>
          </div>

          <div className={styles.row}>
            <span>P/L</span>
            <strong
              className={position.profitLoss >= 0 ? styles.profit : styles.loss}
            >
              {formatCurrency(position.profitLoss)}
            </strong>
          </div>

          <div className={styles.row}>
            <span>ROI</span>
            <strong
              className={position.roi >= 0 ? styles.profit : styles.loss}
            >
              {formatPercentage(position.roi)}
            </strong>
          </div>

          <div className={styles.row}>
            <span>Closed At</span>
            <strong>{formatDate(position.closedAt)}</strong>
          </div>

          <div className={styles.row}>
            <span>Close Reason</span>
            <strong>{position.closeReason || "Manual Close"}</strong>
          </div>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PositionHistoryModal;