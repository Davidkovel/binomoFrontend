import React, { useState, useRef } from 'react';
import styles from './PositionCardModal.module.css';

const PositionHistoryModal = ({
  position,
  onClose,
  formatCurrency,
  formatPercentage,
  formatDate
}) => {
  const modalRef = useRef(null);
  
  const mediaOptions = [
    { id: 1, type: 'image', url: '/trade_icon.png', name: 'Default' },
    { id: 2, type: 'image', url: '/bmw.jpg', name: 'Chart 1' },
    { id: 3, type: 'image', url: '/bmw_video.jpg', name: 'Chart 2' },
    { id: 4, type: 'gif', url: 'https://media.giphy.com/media/67ThRZlYBvibtdF9JH/giphy.gif', name: 'Success GIF' },
    { id: 5, type: 'video', url: '/video_xgenious_dex.mp4', name: 'Trade Video' },
  ];

  const [selectedMedia, setSelectedMedia] = useState(mediaOptions[0]);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const handleDownload = async () => {
    try {
      if (selectedMedia.type === 'image' || selectedMedia.type === 'gif') {
        const response = await fetch(selectedMedia.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `position_${position.symbol}_${Date.now()}.${selectedMedia.type === 'gif' ? 'gif' : 'png'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Не удалось скачать файл. Попробуйте ещё раз.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()} ref={modalRef}>
        {/* Media Background */}
        <div className={styles.mediaContainer}>
          {selectedMedia.type === 'image' && (
            <img 
              src={selectedMedia.url} 
              alt="Background" 
              className={styles.mediaBackground}
            />
          )}
          {selectedMedia.type === 'gif' && (
            <img 
              src={selectedMedia.url} 
              alt="Background GIF" 
              className={styles.mediaBackground}
            />
          )}
          {selectedMedia.type === 'video' && (
            <video 
              src={selectedMedia.url} 
              autoPlay 
              loop 
              muted 
              className={styles.mediaBackground}
            />
          )}
          <div className={styles.mediaOverlay} />
        </div>

        {/* Media Controls */}
        <div className={styles.mediaControls}>
          <button 
            className={styles.mediaButton}
            onClick={() => setIsCarouselOpen(!isCarouselOpen)}
          >
            Change Background
          </button>
          <button 
            className={styles.downloadButton}
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        {/* Carousel */}
        {isCarouselOpen && (
          <div className={styles.carousel}>
            <div className={styles.carouselHeader}>
              <h4 className={styles.carouselTitle}>Select Background</h4>
              <button 
                className={styles.carouselClose}
                onClick={() => setIsCarouselOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.carouselGrid}>
              {mediaOptions.map((media) => (
                <div
                  key={media.id}
                  className={`${styles.carouselItem} ${selectedMedia.id === media.id ? styles.carouselItemActive : ''}`}
                  onClick={() => {
                    setSelectedMedia(media);
                    setIsCarouselOpen(false);
                  }}
                >
                  {(media.type === 'image' || media.type === 'gif') && (
                    <img 
                      src={media.url} 
                      alt={media.name} 
                      className={styles.carouselImage}
                    />
                  )}
                  {media.type === 'video' && (
                    <video 
                      src={media.url} 
                      className={styles.carouselImage} 
                      muted
                    />
                  )}
                  <div className={styles.carouselLabel}>
                    {media.type === 'video' && '🎬 '}
                    {media.type === 'gif' && '🎞️ '}
                    {media.name}
                  </div>
                  {selectedMedia.id === media.id && (
                    <div className={styles.selectedBadge}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.logoTitle}>XGenious</h2>
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
        </div>
      </div>
    </div>
  );
};

export default PositionHistoryModal;