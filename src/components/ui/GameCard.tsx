import * as React from 'react';
import styles from './GameCard.module.css';

interface GameCardProps {
  title: string;
  description?: string;
  image?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  badges?: string[];
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'highlight' | 'selected';
  isAnimated?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  image,
  status,
  badges = [],
  onClick,
  className,
  children,
  variant = 'default',
  isAnimated = true,
}) => {
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    isAnimated && styles['card--animated'],
    onClick && styles['card--clickable'],
    className
  ].filter(Boolean).join(' ');

  const statusClasses = status ? [
    styles.status,
    styles[`status--${status}`]
  ].join(' ') : '';

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.frame}>
        <div className={styles.corner}>┌</div>
        <div className={styles.edge}>─</div>
        <div className={styles.corner}>┐</div>
        <div className={styles.edge}>│</div>
        <div className={styles.content}>
          {image && (
            <div className={styles.imageContainer}>
              <img src={image} alt={title} className={styles.image} />
              {status && <div className={statusClasses} />}
            </div>
          )}
          <div className={styles.info}>
            <h3 className={styles.title}>{title}</h3>
            {description && (
              <p className={styles.description}>{description}</p>
            )}
            {badges.length > 0 && (
              <div className={styles.badges}>
                {badges.map((badge, index) => (
                  <span key={index} className={styles.badge}>{badge}</span>
                ))}
              </div>
            )}
            {children}
          </div>
        </div>
        <div className={styles.edge}>│</div>
        <div className={styles.corner}>└</div>
        <div className={styles.edge}>─</div>
        <div className={styles.corner}>┘</div>
      </div>
      <div className={styles.pixelOverlay} />
    </div>
  );
}; 