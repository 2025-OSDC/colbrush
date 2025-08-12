// src/index.browser.ts
export { ThemeProvider, useTheme } from './components/ThemeProvider.js';
export { ThemeSwitcher } from './components/ThemeSwitcher.js';
export type { ThemeType } from './components/ThemeProvider.js';

export {
    applyTheme,
    readThemeVariables,
    mergeVars,
    prefersReducedMotion,
} from './runtime/applyThemes.js';

export { buildScaleFromBaseHex } from './utils/core/colorScale.js';