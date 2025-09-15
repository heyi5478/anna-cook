import type { Preview } from '@storybook/react';
import '../src/styles/globals.css'; // Tailwind CSS
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    // Anna Cook 設計系統參數
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'gray', value: '#f5f5f5' },
        { name: 'dark', value: '#1a1a1a' }
      ]
    },
    // 支援 CVA 變體自動生成控制項
    docs: {
      extractComponentDescription: (_component, { notes }) => {
        if (notes) return notes;
        return null;
      }
    },

    a11y: {
      test: 'todo',
    },
  },

  // 全域裝飾器
  decorators: [
    (Story) => React.createElement(
      'div',
      { className: 'font-sans antialiased' },
      React.createElement(Story)
    )
  ]
};

export default preview;
