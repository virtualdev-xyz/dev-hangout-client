import React from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
  title: string;
  description?: string;
  image?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  image,
  status = 'offline',
  variant = 'primary',
  onClick,
  className,
  children
}) => {
  return (
    <div 
      className={`
        ${styles.gameCard}
        ${styles[`gameCard--${variant}`]}
        ${onClick ? styles.gameCardClickable : ''}
        ${className || ''}
      `}
      onClick={onClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.gameCardFrame}>
        {image && (
          <div className={styles.gameCardImageWrapper}>
            <img 
              src={image} 
              alt={title}
              className={styles.gameCardImage}
            />
            <div className={styles.gameCardImageOverlay} />
          </div>
        )}
        <div className={styles.gameCardContent}>
          <div className={styles.gameCardHeader}>
            <h3 className={styles.gameCardTitle}>{title}</h3>
            {status && (
              <div className={`${styles.gameCardStatus} ${styles[`gameCardStatus--${status}`]}`}>
                <span className={styles.gameCardStatusDot} />
                {status}
              </div>
            )}
          </div>
          {description && (
            <p className={styles.gameCardDescription}>{description}</p>
          )}
          {children && (
            <div className={styles.gameCardBody}>
              {children}
            </div>
          )}
        </div>
        <div className={styles.gameCardPixelCorners}>
          <div className={styles.gameCardPixelCorner} />
          <div className={styles.gameCardPixelCorner} />
          <div className={styles.gameCardPixelCorner} />
          <div className={styles.gameCardPixelCorner} />
        </div>
      </div>
    </div>
  );
}; 