import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../../styles/theme';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusProps {
  type: StatusType;
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

const getStatusColor = (type: StatusType) => {
  switch (type) {
    case 'success':
      return retroTheme.colors.successGreen;
    case 'error':
      return retroTheme.colors.errorRed;
    case 'warning':
      return retroTheme.colors.warningYellow;
    case 'info':
      return retroTheme.colors.infoBlue;
    default:
      return retroTheme.colors.arcadeTextPrimary;
  }
};

const StatusWrapper = styled.div<{ type: StatusType }>`
  display: inline-flex;
  align-items: center;
  padding: ${retroTheme.spacing[1]} ${retroTheme.spacing[2]};
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid ${({ type }) => getStatusColor(type)};
  border-radius: 2px;
  font-family: ${retroTheme.fonts.terminal};
  font-size: ${retroTheme.fontSizes.sm};
  color: ${({ type }) => getStatusColor(type)};
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: ${retroTheme.shadows.textGlow};
  box-shadow: ${retroTheme.shadows.pixelSoft};
  
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
`;

const StatusIcon = styled.span`
  margin-right: ${retroTheme.spacing[1]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const StatusMessage = styled.span`
  display: inline-block;
`;

export const Status: React.FC<StatusProps> = ({
  type,
  message,
  icon,
  className,
}) => {
  return (
    <StatusWrapper type={type} className={className}>
      {icon && <StatusIcon>{icon}</StatusIcon>}
      <StatusMessage>{message}</StatusMessage>
    </StatusWrapper>
  );
}; 