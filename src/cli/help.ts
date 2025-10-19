import { bold, dim } from './utils/terminalStyles.js';

export function showHelp() {
    console.log('🎨 Colbrush - Accessible Color Theme Generator');
    console.log('');

    console.log(`
${bold('USAGE')}
  colbrush <command> [options]

${bold('COMMANDS')}
  generate              Generate color-blind accessible themes (default)
  --doctor              Run system diagnostics
  --help                Show this help message
  --version             Show version number

${bold('OPTIONS')}
  --css=<path>          Target CSS file (default: src/index.css)
  --no-color            Disable colored output
  --json=<path>         Save detailed report to JSON file

${bold('EXAMPLES')}
  colbrush                                    ${dim('# Generate themes for src/index.css')}
  colbrush generate --css=./styles/main.css  ${dim('# Custom CSS file')}
  colbrush --doctor                           ${dim('# Check system health')}

${bold('SUPPORTED CSS')}
  The tool processes CSS custom properties (CSS variables) in these formats:

  ${dim('/* @theme block */')}
  @theme {
    --color-primary-500: #7fe4c1;     ${dim('/* Will generate color scale */')}
  }

${bold('OUTPUT')}
  Generated themes are automatically appended to your CSS file:
  ${dim('[data-theme="protanopia"] { ... }')}
  ${dim('[data-theme="deuteranopia"] { ... }')}
  ${dim('[data-theme="tritanopia"] { ... }')}

${bold('VISION TYPES')}
  • Protanopia    - Red color blindness
  • Deuteranopia  - Green color blindness
  • Tritanopia    - Blue color blindness

${bold('INTEGRATION')}
  After generation, use in your React app:

  ${dim('// 1. Import your CSS')}
  import "./index.css"

  ${dim('// 2. Wrap with ThemeProvider')}
  import { ThemeProvider } from "colbrush/client"
  <ThemeProvider><App /></ThemeProvider>

  ${dim('// 3. Add theme switcher')}
  import { ThemeSwitcher } from "colbrush/client"
  <ThemeSwitcher />

${bold('LEARN MORE')}
  📖 Documentation: https://colbrush.site
  ⭐ GitHub:        https://github.com/2025-OSDC/colbrush
`);
}