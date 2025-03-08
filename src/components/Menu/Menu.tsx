import React, { useState, useEffect, useCallback } from 'react';
import styles from './Menu.module.css';

interface MenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  activeId?: string;
  onSelect?: (item: MenuItem) => void;
  variant?: 'primary' | 'secondary';
  isVertical?: boolean;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  activeId,
  onSelect,
  variant = 'primary',
  isVertical = true
}) => {
  const [selectedIndex, setSelectedIndex] = useState(
    items.findIndex(item => item.id === activeId) || 0
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isVertical) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
      }
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const selectedItem = items[selectedIndex];
      if (!selectedItem.disabled) {
        onSelect?.(selectedItem);
        selectedItem.onClick?.();
      }
    }
  }, [items, selectedIndex, onSelect, isVertical]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div 
      className={`${styles.menu} ${styles[`menu--${variant}`]} ${isVertical ? styles.menuVertical : styles.menuHorizontal}`}
      role="menu"
      tabIndex={0}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`
            ${styles.menuItem}
            ${index === selectedIndex ? styles.menuItemSelected : ''}
            ${item.disabled ? styles.menuItemDisabled : ''}
          `}
          role="menuitem"
          aria-disabled={item.disabled}
          onClick={() => {
            if (!item.disabled) {
              setSelectedIndex(index);
              onSelect?.(item);
              item.onClick?.();
            }
          }}
        >
          <span className={styles.menuItemArrow}>
            {index === selectedIndex ? '►' : ''}
          </span>
          <span className={styles.menuItemLabel}>{item.label}</span>
          <span className={styles.menuItemArrow}>
            {index === selectedIndex ? '◄' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}; 