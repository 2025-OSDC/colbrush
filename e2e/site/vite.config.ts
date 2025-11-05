import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const libraryRoot = path.resolve(configDir, '../../src');
const distStyles = path.resolve(configDir, '../../dist/styles.css');
const stylesAlias = fs.existsSync(distStyles)
    ? distStyles
    : path.join(libraryRoot, 'styles.css');

const plugins: PluginOption[] = [
    react(),
    tailwindcss() as PluginOption,
];

export default defineConfig({
    plugins,
    server: {
        host: '127.0.0.1',
        port: 4173,
    },
    resolve: {
        alias: {
            'colbrush/client': path.join(libraryRoot, 'client.ts'),
            'colbrush/styles.css': stylesAlias,
            'colbrush/devtools': path.join(libraryRoot, 'devtools/index.ts'),
        },
    },
});
