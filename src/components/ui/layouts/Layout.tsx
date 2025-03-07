import React from 'react';
import styled from 'styled-components';
import { retroTheme } from '../../../styles/theme';

interface LayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${retroTheme.colors.arcadeBgPrimary};
  background-image: 
    ${retroTheme.gradients.gridGradient},
    ${retroTheme.gradients.crtScanline};
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${retroTheme.gradients.vhsTracking};
    opacity: 0.05;
    pointer-events: none;
    z-index: 0;
  }
`;

const Header = styled.header`
  background-color: ${retroTheme.colors.arcadeBgSecondary};
  border-bottom: 2px solid ${retroTheme.colors.arcadeBorderPrimary};
  padding: ${retroTheme.spacing[2]};
  box-shadow: ${retroTheme.shadows.pixelSoft};
  position: relative;
  z-index: 1;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  position: relative;
  z-index: 1;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: ${retroTheme.colors.arcadeBgSecondary};
  border-right: 2px solid ${retroTheme.colors.arcadeBorderPrimary};
  padding: ${retroTheme.spacing[2]};
  box-shadow: ${retroTheme.shadows.pixelSoft};
`;

const Content = styled.div`
  flex: 1;
  padding: ${retroTheme.spacing[2]};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Footer = styled.footer`
  background-color: ${retroTheme.colors.arcadeBgSecondary};
  border-top: 2px solid ${retroTheme.colors.arcadeBorderPrimary};
  padding: ${retroTheme.spacing[2]};
  box-shadow: ${retroTheme.shadows.pixelSoft};
  position: relative;
  z-index: 1;
`;

export const Layout: React.FC<LayoutProps> = ({
  children,
  header,
  footer,
  sidebar,
  className,
}) => {
  return (
    <LayoutWrapper className={className}>
      {header && <Header>{header}</Header>}
      <MainContent>
        {sidebar && <Sidebar>{sidebar}</Sidebar>}
        <Content>{children}</Content>
      </MainContent>
      {footer && <Footer>{footer}</Footer>}
    </LayoutWrapper>
  );
}; 