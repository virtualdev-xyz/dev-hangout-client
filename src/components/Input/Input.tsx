import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  isAnimated?: boolean;
}

export const Input: React.FC<InputProps> = ({
  prefix = '>',
  variant = 'default',
  isAnimated = true,
  className,
  ...props
}) => {
  const inputClasses = [
    styles.input,
    styles[`input--${variant}`],
    isAnimated && styles['input--animated'],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.inputWrapper}>
      {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
      <input className={inputClasses} {...props} />
      <div className={styles.inputCursor} />
    </div>
  );
}; 