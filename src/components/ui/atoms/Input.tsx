import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../../styles/theme';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  fullWidth?: boolean;
  size?: InputSize;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  margin-bottom: ${retroTheme.spacing[2]};
`;

const Label = styled.label`
  display: block;
  font-family: ${retroTheme.fonts.heading};
  font-size: ${retroTheme.fontSizes.sm};
  color: ${retroTheme.colors.arcadeTextSecondary};
  margin-bottom: ${retroTheme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const StyledInput = styled.input<{ size?: InputSize; error?: string; success?: string }>`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${retroTheme.colors.arcadeTextSecondary};
  border: 2px solid ${({ error, success }) => {
    if (error) return retroTheme.colors.errorRed;
    if (success) return retroTheme.colors.successGreen;
    return retroTheme.colors.arcadeBorderPrimary;
  }};
  padding: ${({ size }) => {
    switch (size) {
      case 'sm':
        return retroTheme.spacing[1];
      case 'lg':
        return retroTheme.spacing[2];
      default:
        return retroTheme.spacing[1.5];
    }
  }};
  font-family: ${retroTheme.fonts.terminal};
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
  transition: all ${retroTheme.timings.fast} ease;
  
  &:focus {
    outline: none;
    border-color: ${retroTheme.colors.arcadeTextPrimary};
    box-shadow: ${retroTheme.shadows.pixelSoft};
  }
  
  &:disabled {
    background-color: rgba(0, 0, 0, 0.5);
    border-color: ${retroTheme.colors.arcadeButtonDisabled};
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-family: ${retroTheme.fonts.terminal};
  font-size: ${retroTheme.fontSizes.sm};
  color: ${retroTheme.colors.errorRed};
  margin-top: ${retroTheme.spacing[1]};
  text-shadow: ${retroTheme.shadows.textGlow};
`;

const SuccessMessage = styled.span`
  display: block;
  font-family: ${retroTheme.fonts.terminal};
  font-size: ${retroTheme.fontSizes.sm};
  color: ${retroTheme.colors.successGreen};
  margin-top: ${retroTheme.spacing[1]};
  text-shadow: ${retroTheme.shadows.textGlow};
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  fullWidth,
  size = 'md',
  className,
  ...props
}) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && <Label>{label}</Label>}
      <StyledInput
        size={size}
        error={error}
        success={success}
        className={className}
        {...props}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </InputWrapper>
  );
}; 