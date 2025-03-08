import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'dark',
  brandTitle: 'Arcade UI Components',
  brandUrl: 'https://github.com/yourusername/your-repo',
  brandImage: undefined,

  // UI
  appBg: '#050510',
  appContentBg: '#0c0c2a',
  appBorderColor: '#1a1a7a',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Press Start 2P", monospace',
  fontCode: '"Fira Code", monospace',

  // Text colors
  textColor: '#00ff00',
  textInverseColor: '#141450',

  // Toolbar default and active colors
  barTextColor: '#00ffff',
  barSelectedColor: '#ff00ff',
  barBg: '#141450',

  // Form colors
  inputBg: '#0c0c2a',
  inputBorder: '#1a1a7a',
  inputTextColor: '#00ff00',
  inputBorderRadius: 4,
});

addons.setConfig({
  theme,
  showToolbar: true,
}); 