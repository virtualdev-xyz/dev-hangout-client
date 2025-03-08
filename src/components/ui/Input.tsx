import * as React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  error?: string;
  showCursor?: boolean;
  variant?: 'default' | 'terminal' | 'code';
}

export const Input: React.FC<InputProps> = ({
  label,
  prefix = '>',
  error,
  showCursor = true,
  variant = 'default',
  className,
  disabled,
  ...props
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const inputClasses = [
    styles.input,
    styles[`input--${variant}`],
    showCursor && styles['input--cursor'],
    isFocused && styles['input--focused'],
    disabled && styles['input--disabled'],
    error && styles['input--error'],
    className
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    styles[`container--${variant}`],
    disabled && styles['container--disabled']
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} onClick={handleContainerClick}>
      {label && (
        <label className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {variant === 'terminal' && (
          <span className={styles.prefix}>{prefix}</span>
        )}
        <input
          ref={inputRef}
          className={inputClasses}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {showCursor && isFocused && (
          <span className={styles.cursor} />
        )}
      </div>
      {error && (
        <span className={styles.error}>{error}</span>
      )}
    </div>
  );
}; 