import * as React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  isPixelated?: boolean;
  isAnimated?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isPixelated = true,
  isAnimated = true,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    isPixelated && styles['button--pixelated'],
    isAnimated && styles['button--animated'],
    disabled && styles['button--disabled'],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      <span className={styles.button__content}>{children}</span>
      {isAnimated && <span className={styles.button__shine} />}
    </button>
  );
}; 