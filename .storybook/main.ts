import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/nextjs',
    options: {}
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false
  },

  staticDirs: [
    '../public'
  ],

  // Anna Cook 專案特殊配置
  features: {
    experimentalRSC: false // Pages Router 不需要
  }
};

export default config;