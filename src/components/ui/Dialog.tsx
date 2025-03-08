import * as React from 'react';
import { createPortal } from 'react-dom';
import styles from './Dialog.module.css';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'alert' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  showCloseButton?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'medium',
  showCloseButton = true,
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const dialogClasses = [
    styles.dialog,
    styles[`dialog--${variant}`],
    styles[`dialog--${size}`],
    isAnimating && styles['dialog--animating']
  ].filter(Boolean).join(' ');

  const dialog = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div 
        ref={dialogRef}
        className={dialogClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        <div className={styles.border}>
          <div className={styles.corner}>+</div>
          <div className={styles.edge}>-</div>
          <div className={styles.corner}>+</div>
          <div className={styles.edge}>|</div>
          <div className={styles.content}>
            {title && (
              <div className={styles.header}>
                <h2 id="dialog-title" className={styles.title}>{title}</h2>
                {showCloseButton && (
                  <button 
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    ×
                  </button>
                )}
              </div>
            )}
            <div className={styles.body}>
              {children}
            </div>
          </div>
          <div className={styles.edge}>|</div>
          <div className={styles.corner}>+</div>
          <div className={styles.edge}>-</div>
          <div className={styles.corner}>+</div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}; 