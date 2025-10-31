# colbrush

#### A React theme switching library that makes it easy to apply color-blind accessible UI themes.

<img width="1434" height="314" alt="colbrush" src="https://github.com/user-attachments/assets/c009bd8c-974c-4e99-b28b-86acb9df26d9" />

---

## Features

- ✅ Support for color blindness types: `protanopia`, `deuteranopia`, `tritanopia`
- ⚙️ Automatic CSS variable generation via PostCSS (`@theme` syntax supported)
- 🎛 Provides a `ThemeProvider` based on React Context
- 🎨 Accessible `ThemeSwitcher` component included
- 🧩 Built-in hook for runtime updates:
    - `useTheme()` – provides access to theme and language states

        ```js
        const { theme, useUpdateTheme, language, useUpdateLanguage } =
            useTheme();
        ```

        - `theme`: currently active theme name
        - `updateTheme(theme: ThemeType)`: update the current theme (supports color-blind modes)
        - `language`: current language setting (currently supports **Korean** and **English**)
        - `updateLanguage(language: TLanguage)`: update the language context
- 🧪 Customizable color scales and transformation algorithms

---

## Installation

```bash
pnpm add colbrush
# or
npm install colbrush
```

---

## Usage

### 1. Define CSS variables (index.css or global CSS)

```css
@theme {
    --color-primary-500: #7fe4c1;
    --color-secondary-yellow: #fdfa91;
    --color-default-gray-500: #c3c3c3;
}
```

### 2. Generate color-blind themes

**Prerequisite:** Define your base palette **in a CSS file (e.g., `src/index.css`) using HEX colors (`#RRGGBB`)**.  
Variables can be declared inside an `@theme { ... }` block (recommended) or `:root { ... }`.

Example (`src/index.css`):

```css
@theme {
    --color-primary-500: #7fe4c1;
    --color-secondary-yellow: #fdfa91;
    --color-default-gray-500: #c3c3c3;
}
```

Then run the generator:

#### Default: reads/writes to src/index.css

```bash
npx colbrush --generate
```

Use a different file (optional):

```bash
npx colbrush --generate --css=path/to/your.css
```

#### Notes

Colbrush now supports all color formats — `HEX`, `RGB`, `HSL`, `HWB`, `LAB`, `LCH`, `OKLCH`, and named CSS colors.<br/>
If `--css` is omitted, Colbrush uses `src/index.css` by default.  
Generated color-blind variants are appended to the same file below your @theme block.

### 3. Wrap your app with ThemeProvider

```
import { ThemeProvider } from 'colbrush/client';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 4. Import colbrush/styles.css

```
// index.css
@import 'colbrush/styles.css';
```

### 5. Use the ThemeSwitcher component

```
import { ThemeSwitcher } from 'colbrush/client';

function Settings() {
  return (
    <ThemeSwitcher
      position="right-bottom"
      ...
    />
  );
}
```

| **Prop**    | **Type**                                                  | **Default**    | **Description**                                                                                                                                                   |
| ----------- | --------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options?`  | `{ key: ThemeKey; label: string; }[]`                     | `undefined`    | Defines the selectable themes shown in the dropdown.<br>Each object contains:<br>• `key`: theme identifier (`ThemeKey`)<br>• `label`: display name for the theme. |
| `position?` | `left-top` / `right-top` / `left-bottom` / `right-bottom` | `right-bottom` | Determines where the ThemeSwitcher dropdown appears.                                                                                                              |

### 6. Use hooks for theme and language switching

```
import { useTheme } from 'colbrush/client';

export default function TestPage() {
    const { theme, updateTheme, language, updateLanguage } = useTheme();

    return (
        <div className="flex">
            <button onClick={() => updateTheme('tritanopia')}>Change to tritanopia</button>
            <button onClick={() => updateLanguage('English')}>Change to English</button>
        </div>
    );
}
```

### 6. Apply SimulationFilter for vision simulation

```
import { SimulationFilter } from 'colbrush/devtools';

function App() {
    return (
        <ThemeProvider>
            <SimulationFilter
                initialMode="normal"
                toolbarPosition="left-bottom"
                ...>
                <YourApp />
            </SimulationFilter>
        </ThemeProvider>
    );
}

```

| **SimulationFilterProp** | **Type**                                                  | **Default**                   | **Description**                                                       |
| ------------------------ | --------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `initialMode?`           | `none` / `protanopia` / `deuteranopia` / `tritanopia`     | `none`                        | initial simulation mode                                               |
| `position?`              | `left-top` / `right-top` / `left-bottom` / `right-bottom` | `left-bottom`                 | toolbar position                                                      |
| `allowInProd?`           | `boolean`                                                 | `false`                       | Forces the filter to be available in production (for debugging)       |
| `storageKey?`            | `string`                                                  | `colbrush-filter`             | Customizes the `localStorage` key used to store the simulation state. |
| `devHostPattern?`        | `string`                                                  | `localhost / 127 / 192.168.x` | Defines a custom regular expression for allowed development hosts.    |

## Supported Vision Types

| **Vision Type** | **설명** |
| --------------- | -------- |
| protanopia      | 적색맹   |
| deuteranopia    | 녹색맹   |
| tritanopia      | 청색맹   |

## CLI (Command-Line Interface)

**Description:**  
Colbrush provides a command-line tool that automatically generates accessibility-optimized color themes for  
**Protanopia (red-blindness)**, **Deuteranopia (green-blindness)**, and **Tritanopia (blue-blindness)**  
based on developer-defined CSS variables.  
The generated themes are appended directly to the existing CSS file.

### Commands and Usage

| **Command**           | **Description**                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `colbrush --generate` | Generates accessibility color themes for users with color vision deficiencies (default command). |
| `colbrush --doctor`   | Runs a system diagnostic to detect environment or configuration issues.                          |
| `colbrush --help`     | Displays all available commands and usage options.                                               |
| `colbrush --version`  | Shows the currently installed version of Colbrush (e.g., `v1.6.0`).                              |

### Options

| **Option**      | **Description**                                                          | **Default**     |
| --------------- | ------------------------------------------------------------------------ | --------------- |
| `--css=<path>`  | Specifies the target CSS file path for theme generation.                 | `src/index.css` |
| `--no-color`    | Disables colored output in the CLI.                                      | —               |
| `--json=<path>` | Saves a detailed generation report as a JSON file at the specified path. | —               |

For more details, visit the **[👉 Colbrush Official Website](https://www.colbrush.site)**.

## 👥 Team

| ![suho](https://github.com/user-attachments/assets/10c25151-e122-4ddb-8d8c-8b802c01c738) | ![hayoung](https://github.com/user-attachments/assets/7b7b453e-82f1-4f8e-bcc9-edba4d6fa279) | ![yeonjin](https://github.com/user-attachments/assets/55a2e27b-cb75-4115-a0ff-cfe97610ca97) | ![hyeseong](https://github.com/user-attachments/assets/9cdf9354-0d31-4410-ad94-f57ffc684849) | ![junhee](https://github.com/user-attachments/assets/aeebf2cc-5aaa-4eac-bbe4-e093dac3d60a) |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **윤수호**                                                                               | **노하영**                                                                                  | [**김연진**](https://github.com/yeonjin719)                                                 | [**윤혜성**](https://github.com/hyesngy)                                                     | [**이준희**](https://github.com/jjjuni)                                                    |
| PM                                                                                       | Designer                                                                                    | Frontend · Library Engineer                                                                 | Frontend · Library Engineer                                                                  | Frontend · Library Engineer                                                                |

## 🤝 Contributing

We welcome contributions from the community! Colbrush is an open-source project, and we'd love your help to make it better.

### How to Contribute

- 🐛 **Report bugs** - Found a bug? [Open an issue](https://github.com/2025-OSDC/colbrush/issues)
- ✨ **Suggest features** - Have an idea? [Share it with us](https://github.com/2025-OSDC/colbrush/issues)
- 📝 **Improve documentation** - Help us make our docs better
- 💻 **Submit pull requests** - Fix bugs or add new features

Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to contribute.

## 📜 License

MIT License

Copyright (c) 2025 colbrush

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

