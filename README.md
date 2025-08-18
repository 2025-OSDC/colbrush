# colbrush
#### A React theme switching library that makes it easy to apply color-blind accessible UI themes.  
<img width="1440" height="900" alt="Angular Gradient" src="https://github.com/user-attachments/assets/37e4ffb9-1840-4828-949c-0ffe5e14903e" />


---

## Features

- ✅ Support for color blindness types: `protanopia`, `deuteranopia`, `tritanopia`
- ⚙️ Automatic CSS variable generation via PostCSS (`@theme` syntax supported)
- 🎛 Provides a `ThemeProvider` based on React Context
- 🎨 Accessible `ThemeSwitcher` component included
- 🧩 Built-in hooks for runtime updates:  
  - `useUpdateTheme` – change the current theme (including color-blind modes)  
  - `useUpdateLanguage` – change the language context
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
```
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
```
npx colbrush --generate
```
Use a different file (optional):
```
npx colbrush --generate --css=path/to/your.css
```

#### Notes

Only HEX values are processed (e.g., #7fe4c1). Named colors, rgb()/hsl() are ignored.
If --css is omitted, Colbrush uses src/index.css by default.
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
### 4. Use the ThemeSwitcher component
```
import { ThemeSwitcher } from 'colbrush/client';
import 'colbrush/styles.css';

function Settings() {
  return <ThemeSwitcher />;
}
```
### 5. Use hooks for theme and language switching
```
import { useUpdateLanguage, useUpdateTheme } from 'colbrush/client';

export default function TestPage() {
    const updateTheme = useUpdateTheme();
    const updateLanguage = useUpdateLanguage();

    return (
        <div className="flex">
            <button onClick={() => updateTheme('tritanopia')}>색맹 유형 변경</button>
            <button onClick={() => updateLanguage('English')}>언어 변경</button>
        </div>
    );
}
```
## Supported Vision Types
| **Vision Type** | **설명** |
| --------------- | ------ |
| protanopia      | 적색맹    |
| deuteranopia    | 녹색맹    |
| tritanopia      | 청색맹    |

## 👥 Team

| ![suho](https://github.com/user-attachments/assets/10c25151-e122-4ddb-8d8c-8b802c01c738) | ![hayoung](https://github.com/user-attachments/assets/7b7b453e-82f1-4f8e-bcc9-edba4d6fa279) | ![yeonjin](https://github.com/user-attachments/assets/55a2e27b-cb75-4115-a0ff-cfe97610ca97) | ![hyeseong](https://github.com/user-attachments/assets/9cdf9354-0d31-4410-ad94-f57ffc684849) | ![junhee](https://via.placeholder.com/100) |
| ---------------------------------------- | ------------------------------------------- | ------------------------------------------- | -------------------------------------------- | ------------------------------------------ |
| **윤수호**                               | **노하영**                                  | [**김연진**](https://github.com/yeonjin719)   | [**윤혜성**](https://github.com/hyesngy)                                   | [**이준희**](https://github.com/jjjuni)                                  |
| PM                                       | Designer                                    | Frontend · Library Engineer                 | Frontend · Library Engineer                  | Frontend · Library Engineer                 |


# 📜 License

Copyright (c) 2025 Team Colbrush

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
