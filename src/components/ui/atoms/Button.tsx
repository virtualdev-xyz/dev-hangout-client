import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const StyledButton = styled.button<ButtonProps>`
  background-color: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return retroTheme.colors.arcadeButtonPrimary;
      case 'secondary':
        return retroTheme.colors.arcadeButtonSecondary;
      case 'tertiary':
        return retroTheme.colors.arcadeButtonTertiary;
      case 'danger':
        return retroTheme.colors.digitalRed;
      default:
        return retroTheme.colors.arcadeBgTertiary;
    }
  }};
  
  color: ${({ variant }) => variant === 'tertiary' ? retroTheme.colors.arcadeTextPrimary : 'white'};
  border: 2px solid ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return retroTheme.colors.arcadeButtonPrimary;
      case 'secondary':
        return retroTheme.colors.arcadeButtonSecondary;
      case 'tertiary':
        return retroTheme.colors.arcadeBorderPrimary;
      case 'danger':
        return retroTheme.colors.digitalRed;
      default:
        return retroTheme.colors.arcadeBorderPrimary;
    }
  }};
  
  padding: ${({ size }) => {
    switch (size) {
      case 'sm':
        return 'var(--grid-1) var(--grid-2)';
      case 'lg':
        return 'var(--grid-2) var(--grid-4)';
      default:
        return 'var(--grid-1-5) var(--grid-3)';
    }
  }};
  
  font-size: ${({ size }) => {
    switch (size) {
      case 'sm':
        return retroTheme.fontSizes.sm;
      case 'lg':
        return retroTheme.fontSizes.lg;
      default:
        return retroTheme.fontSizes.md;
    }
  }};
  
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  font-family: ${retroTheme.fonts.heading};
  text-transform: uppercase;
  cursor: pointer;
  transition: all ${retroTheme.timings.fast} ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${({ variant }) => {
      switch (variant) {
        case 'primary':
          return retroTheme.colors.arcadeBgHighlight;
        case 'secondary':
          return retroTheme.colors.arcadeBgHighlight;
        case 'tertiary':
          return retroTheme.colors.arcadeBgHighlight;
        case 'danger':
          return retroTheme.colors.digitalRed;
        default:
          return retroTheme.colors.arcadeBgHighlight;
      }
    }};
    border-color: ${retroTheme.colors.arcadeTextPrimary};
    box-shadow: ${retroTheme.shadows.pixelSoft};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: none;
    box-shadow: ${retroTheme.shadows.pixelHard};
  }
  
  &:disabled {
    background-color: ${retroTheme.colors.arcadeButtonDisabled};
    border-color: ${retroTheme.colors.arcadeButtonDisabled};
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </StyledButton>
  );
}; 