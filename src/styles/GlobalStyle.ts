import { createGlobalStyle } from 'styled-components';
import { retroTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  /* Import retro fonts */
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  
  /* VCR OSD Mono and DOS fonts need to be added via @font-face */
  @font-face {
    font-family: 'VCR OSD Mono';
    src: url('/fonts/VCR_OSD_MONO.woff2') format('woff2'),
         url('/fonts/VCR_OSD_MONO.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'DOS';
    src: url('/fonts/DOS.woff2') format('woff2'),
         url('/fonts/DOS.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    image-rendering: pixelated;
  }

  body {
    background-color: ${retroTheme.colors.spaceBlack};
    color: ${retroTheme.colors.neonGreen};
    font-family: ${retroTheme.fonts.body};
    line-height: 1.5;
    position: relative;
    
    /* Apply CRT scanline effect */
    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: ${retroTheme.gradients.crtScanline};
      z-index: 9999;
      opacity: 0.3;
    }
  }

  /* Typography styles */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${retroTheme.fonts.heading};
    margin-bottom: ${retroTheme.spacing[2]};
    color: ${retroTheme.colors.crtBlue};
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h1 {
    font-size: ${retroTheme.fontSizes.xl};
    text-shadow: 0 0 5px ${retroTheme.colors.crtBlue};
  }

  h2 {
    font-size: ${retroTheme.fontSizes.lg};
  }

  h3 {
    font-size: ${retroTheme.fontSizes.md};
  }

  p {
    margin-bottom: ${retroTheme.spacing[2]};
  }

  a {
    color: ${retroTheme.colors.electricBlue};
    text-decoration: none;
    transition: all ${retroTheme.timings.fast} ease;
    
    &:hover {
      color: ${retroTheme.colors.crtBlue};
      text-shadow: ${retroTheme.shadows.textGlow};
    }
  }

  /* Animation keyframes */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @keyframes glitchEffect {
    0%, 100% { transform: translate(0); }
    25% { transform: translate(-2px, 2px); }
    50% { transform: translate(2px, -2px); }
    75% { transform: translate(-1px, -1px); }
  }

  @keyframes pulseEffect {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  @keyframes floatEffect {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes scanlineScroll {
    0% { background-position: 0 0; }
    100% { background-position: 0 100%; }
  }

  @keyframes textTyping {
    from { width: 0; }
    to { width: 100%; }
  }
`;

export default GlobalStyle;
