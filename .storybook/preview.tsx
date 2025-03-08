import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/styles/colors.css';
import '../src/styles/typography.css';
import '../src/styles/arcade-theme.css';
import '../src/styles/animations.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'arcade-dark',
      values: [
        {
          name: 'arcade-dark',
          value: '#050510',
        },
        {
          name: 'arcade-light',
          value: '#0c0c2a',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="arcade-theme" style={{ padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview; 