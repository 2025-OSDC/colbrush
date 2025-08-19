import { defineConfig } from 'tsup';
export default defineConfig([
    // Browser 엔트리 (라이브러리)
    {
        entry: { client: 'src/client.ts' },
        format: ['esm'],
        platform: 'browser',
        target: 'es2020',
        outDir: 'dist',
        dts: true,
        external: [
            'postcss',
            'postcss-safe-parser',
            'fs',
            'node:fs',
            'path',
            'node:path',
            'url',
            'node:url',
        ],
        clean: false,
    },
    {
        entry: { cli: 'src/cli.ts' },
        format: ['cjs'],
        platform: 'node',
        target: 'node18',
        outDir: 'dist',
        dts: false,
        splitting: false,
        external: ['postcss', 'postcss-safe-parser', 'chokidar'],
        tsconfig: 'tsconfig.node.json',
        clean: false,
        banner: { js: '#!/usr/bin/env node' },
        outExtension: ({ format }) => ({
            js: format === 'cjs' ? '.cjs' : '.js',
        }),
    },
]);
