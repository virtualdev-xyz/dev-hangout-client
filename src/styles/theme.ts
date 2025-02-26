export const retroTheme = {
  colors: {
    // Main palette based on CRT colors
    crtBlue: '#00FFFF',
    magenta: '#FF00FF',
    neonGreen: '#00FF00',
    bitYellow: '#FFFF00',
    digitalRed: '#FF0000',

    // Background colors
    spaceBlack: '#0A0A1F',
    terminalGreen: '#001100',
    darkNavy: '#000033',

    // UI element colors
    pixelGray: '#AAAAAA',
    screenGlow: '#00BBBB',
    errorRed: '#FF0000',
    powerUpGreen: '#00FF66',
  },

  fonts: {
    heading: '"Press Start 2P", monospace',
    subheading: '"VCR OSD Mono", monospace',
    body: '"Share Tech Mono", monospace',
    code: '"DOS", monospace',
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
  },
};
