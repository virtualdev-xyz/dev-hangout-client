import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../../styles/theme';

interface CardProps {
  variant?: 'default' | 'highlight' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${({ variant }) => {
    switch (variant) {
      case 'highlight':
        return retroTheme.colors.arcadeBgHighlight;
      case 'bordered':
        return retroTheme.colors.arcadeBgSecondary;
      default:
        return retroTheme.colors.arcadeBgTertiary;
    }
  }};
  
  border: ${({ variant }) => {
    switch (variant) {
      case 'highlight':
        return `2px solid ${retroTheme.colors.arcadeTextPrimary}`;
      case 'bordered':
        return `2px solid ${retroTheme.colors.arcadeBorderPrimary}`;
      default:
        return 'none';
    }
  }};
  
  padding: ${({ padding }) => {
    switch (padding) {
      case 'none':
        return '0';
      case 'sm':
        return retroTheme.spacing[1];
      case 'lg':
        return retroTheme.spacing[4];
      default:
        return retroTheme.spacing[2];
    }
  }};
  
  box-shadow: ${({ glow }) => glow ? retroTheme.shadows.pixelHard : retroTheme.shadows.pixelSoft};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${retroTheme.gradients.vhsTracking};
    opacity: 0.1;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${retroTheme.gradients.crtScanline};
    opacity: 0.05;
    pointer-events: none;
  }
`;

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  glow = false,
  className,
  children,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      glow={glow}
      className={className}
      {...props}
    >
      {children}
    </StyledCard>
  );
}; 