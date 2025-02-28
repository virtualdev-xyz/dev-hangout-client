export const retroTheme = {
  colors: {
    // Primary palette
    crtBlue: '#00FFFF',
    magenta: '#FF00FF',
    neonGreen: '#00FF00',
    bitYellow: '#FFFF00',
    digitalRed: '#FF0000',
    spaceBlack: '#0A0A1F',
    terminalGreen: '#001100',
    
    // Extended palette
    arcadePurple: '#9900FF',
    retroOrange: '#FF6600',
    pixelTeal: '#00AA99',
    consoleGray: '#AAAAAA',
    vhsBlue: '#0066FF',
    cassetteBrown: '#996633',
    pastelPink: '#FF99CC',
    electricBlue: '#0099FF',
    
    // UI element colors
    screenGlow: '#00BBBB',
    errorRed: '#FF0000',
    successGreen: '#00FF66',
    warningYellow: '#FFCC00',
    infoBlue: '#00CCFF',
    disabledGray: '#666666',
    selectionPurple: '#9900FF80',
    
    // Background colors
    darkNavy: '#000033',
  },

  gradients: {
    gridGradient: 'linear-gradient(0deg, #000022 0%, #000066 100%)',
    crtScanline: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 1px, transparent 1px, transparent 2px)',
    vhsTracking: 'linear-gradient(90deg, rgba(255, 0, 255, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%)',
  },

  fonts: {
    heading: '"Press Start 2P", monospace',
    subheading: '"VCR OSD Mono", monospace',
    body: '"Share Tech Mono", monospace',
    code: '"DOS", monospace',
  },

  fontSizes: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  spacing: {
    1: '8px',
    2: '16px',
    3: '24px',
    4: '32px',
    5: '40px',
    6: '48px',
    7: '56px',
    8: '64px',
  },

  grid: {
    base: 8,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64],
  },

  borders: {
    pixel: '2px solid',
    pixelDouble: '4px double',
    pixelDashed: '2px dashed',
    pixelInset: '2px inset',
  },

  animations: {
    cursor: 'blink 1s step-end infinite',
    walk: 'walkCycle 0.5s steps(4) infinite',
    idle: 'idleAnimation 1s steps(2) infinite',
    flash: 'screenFlash 0.2s step-end',
    textType: 'textTyping 3s steps(40, end)',
    glitch: 'glitchEffect 0.3s step-end infinite',
    pulse: 'pulseEffect 2s ease-in-out infinite',
    float: 'floatEffect 3s ease-in-out infinite',
    scanline: 'scanlineScroll 10s linear infinite',
  },

  timings: {
    fast: '0.2s',
    medium: '0.5s',
    slow: '1s',
  },

  shadows: {
    pixelSoft: '0 2px 0 rgba(0, 0, 0, 0.5)',
    pixelHard: '4px 4px 0 rgba(0, 0, 0, 0.8)',
    neonGlow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
    textGlow: '0 0 5px currentColor',
  },

  effects: {
    pixelate: 'image-rendering: pixelated',
    crtFilter: 'brightness(1.1) contrast(1.2) saturate(1.2)',
    noiseFilter: 'url(#noise)',
    glitchFilter: 'url(#glitch)',
  },
};
