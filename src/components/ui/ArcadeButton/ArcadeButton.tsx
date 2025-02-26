import React from 'react';
import styles from './ArcadeButton.module.css';

interface ArcadeButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'boss-key';
  onClick?: () => void;
  disabled?: boolean;
}

export const ArcadeButton: React.FC<ArcadeButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`${styles.arcadeButton} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
