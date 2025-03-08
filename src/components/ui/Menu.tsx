import * as React from 'react';
import styles from './Menu.module.css';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

interface MenuProps {
  items: MenuItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  variant?: 'vertical' | 'horizontal';
  showArrow?: boolean;
  arrowCharacter?: string;
  isAnimated?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  selectedId,
  onSelect,
  className,
  variant = 'vertical',
  showArrow = true,
  arrowCharacter = '►',
  isAnimated = true,
}) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, item: MenuItem) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(item);
    }

    if (variant === 'vertical') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = items.findIndex(i => i.id === focusedId);
        const nextIndex = (currentIndex + 1) % items.length;
        setFocusedId(items[nextIndex].id);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = items.findIndex(i => i.id === focusedId);
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        setFocusedId(items[prevIndex].id);
      }
    } else {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = items.findIndex(i => i.id === focusedId);
        const nextIndex = (currentIndex + 1) % items.length;
        setFocusedId(items[nextIndex].id);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currentIndex = items.findIndex(i => i.id === focusedId);
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        setFocusedId(items[prevIndex].id);
      }
    }
  };

  const handleSelect = (item: MenuItem) => {
    if (item.disabled) return;
    onSelect?.(item.id);
    item.onClick?.();
  };

  const menuClasses = [
    styles.menu,
    styles[`menu--${variant}`],
    isAnimated && styles['menu--animated'],
    className
  ].filter(Boolean).join(' ');

  return (
    <nav className={menuClasses} role="menu">
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const isHovered = item.id === hoveredId;
        const isFocused = item.id === focusedId;

        const itemClasses = [
          styles.item,
          isSelected && styles['item--selected'],
          isHovered && styles['item--hovered'],
          isFocused && styles['item--focused'],
          item.disabled && styles['item--disabled']
        ].filter(Boolean).join(' ');

        return (
          <div
            key={item.id}
            className={itemClasses}
            onClick={() => handleSelect(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setFocusedId(item.id)}
            onBlur={() => setFocusedId(null)}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            aria-disabled={item.disabled}
            aria-selected={isSelected}
            onKeyDown={(e) => handleKeyDown(e, item)}
          >
            {showArrow && (isSelected || isHovered || isFocused) && (
              <span className={styles.arrow}>{arrowCharacter}</span>
            )}
            {item.icon && (
              <span className={styles.icon}>{item.icon}</span>
            )}
            <span className={styles.label}>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}; 