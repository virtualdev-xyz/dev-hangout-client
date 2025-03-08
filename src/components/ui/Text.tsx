import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../styles/theme';

interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'code';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold';
  glow?: boolean;
  pixelated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const StyledText = styled.span<TextProps>`
  display: block;
  color: ${({ color }) => color || retroTheme.colors.arcadeTextPrimary};
  text-align: ${({ align }) => align || 'left'};
  font-weight: ${({ weight }) => weight || 'normal'};
  text-shadow: ${({ glow }) => glow ? retroTheme.shadows.textGlow : 'none'};
  image-rendering: ${({ pixelated }) => pixelated ? 'pixelated' : 'auto'};
  
  ${({ variant }) => {
    switch (variant) {
      case 'h1':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.xxl};
          line-height: 1.2;
          margin-bottom: ${retroTheme.spacing[4]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'h2':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.xl};
          line-height: 1.3;
          margin-bottom: ${retroTheme.spacing[3]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'h3':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.lg};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[2]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'h4':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.md};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[2]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'h5':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.sm};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[2]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'h6':
        return `
          font-family: ${retroTheme.fonts.heading};
          font-size: ${retroTheme.fontSizes.xs};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[2]};
          text-transform: uppercase;
          letter-spacing: 1px;
        `;
      case 'body':
        return `
          font-family: ${retroTheme.fonts.body};
          font-size: ${retroTheme.fontSizes.md};
          line-height: 1.5;
          margin-bottom: ${retroTheme.spacing[2]};
        `;
      case 'caption':
        return `
          font-family: ${retroTheme.fonts.body};
          font-size: ${retroTheme.fontSizes.sm};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[1]};
        `;
      case 'code':
        return `
          font-family: ${retroTheme.fonts.code};
          font-size: ${retroTheme.fontSizes.sm};
          line-height: 1.4;
          margin-bottom: ${retroTheme.spacing[1]};
          background-color: rgba(0, 0, 0, 0.3);
          padding: ${retroTheme.spacing[1]};
          border: 1px solid ${retroTheme.colors.arcadeBorderPrimary};
        `;
      default:
        return `
          font-family: ${retroTheme.fonts.body};
          font-size: ${retroTheme.fontSizes.md};
          line-height: 1.5;
          margin-bottom: ${retroTheme.spacing[2]};
        `;
    }
  }}
`;

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  weight,
  glow,
  pixelated,
  className,
  style,
  children,
  ...props
}) => {
  const Component = variant.startsWith('h') ? variant : 'span';
  
  return (
    <StyledText
      as={Component}
      variant={variant}
      color={color}
      align={align}
      weight={weight}
      glow={glow}
      pixelated={pixelated}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledText>
  );
}; 