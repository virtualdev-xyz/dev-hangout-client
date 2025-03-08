import React from 'react';
import styles from './Dialog.module.css';
import { Button } from '../Button/Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  variant = 'info',
  size = 'medium'
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay} onClick={onClose}>
      <div 
        className={`${styles.dialogContainer} ${styles[`dialog--${size}`]} ${styles[`dialog--${variant}`]}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.dialogFrame}>
          <div className={styles.dialogHeader}>
            <div className={styles.dialogTitle}>{title}</div>
            <Button 
              variant="secondary"
              size="small"
              onClick={onClose}
              className={styles.dialogClose}
            >
              ×
            </Button>
          </div>
          <div className={styles.dialogContent}>
            {children}
          </div>
          {actions && (
            <div className={styles.dialogActions}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 