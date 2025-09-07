// ESLint flat config (ESLint v9+)
// Layered import boundaries:
// - core: may be imported by anyone, but cannot import other layers
// - cli: Node-only; cannot import react/browser
// - react: UI layer; cannot import cli/browser
// - browser: DOM utils; cannot import cli/react

import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Enforce cross-layer boundaries
      'import/no-restricted-paths': ['error', {
        zones: [
          // core cannot import from any other layer
          { target: './src/core', from: './src/cli', message: 'core 레이어는 cli(Node) 레이어를 import 할 수 없습니다.' },
          { target: './src/core', from: './src/react', message: 'core 레이어는 react(UI) 레이어를 import 할 수 없습니다.' },
          { target: './src/core', from: './src/browser', message: 'core 레이어는 browser(DOM) 레이어를 import 할 수 없습니다.' },

          // cli must not import UI/browser
          { target: './src/cli', from: './src/react', message: 'cli(Node) 레이어는 react(UI) 레이어를 import 할 수 없습니다.' },
          { target: './src/cli', from: './src/browser', message: 'cli(Node) 레이어는 browser(DOM) 레이어를 import 할 수 없습니다.' },

          // react must not import cli/browser
          { target: './src/react', from: './src/cli', message: 'react(UI) 레이어는 cli(Node) 레이어를 import 할 수 없습니다.' },
          { target: './src/react', from: './src/browser', message: 'react(UI) 레이어는 browser(DOM) 레이어를 import 하지 마세요. (DOM 유틸은 browser에 유지) ' },

          // browser must not import cli/react
          { target: './src/browser', from: './src/cli', message: 'browser(DOM) 레이어는 cli(Node) 레이어를 import 할 수 없습니다.' },
          { target: './src/browser', from: './src/react', message: 'browser(DOM) 레이어는 react(UI) 레이어를 import 하지 마세요.' },
        ],
      }],
    },
  },
];
