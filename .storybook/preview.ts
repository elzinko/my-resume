import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'cv-dark',
      values: [
        { name: 'cv-dark', value: '#0f172a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
  },
};

export default preview;
