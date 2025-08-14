import { defineConfig } from 'tsup';

export default defineConfig([
    // Node 엔트리 (라이브러리)
    {
        entry: {
            index: 'src/index.ts',
            'index.node': 'src/index.ts',
            client: 'src/client.ts',
        },
        format: ['esm', 'cjs'],
        platform: 'node',
        target: 'node18',
        outDir: 'dist',
        dts: { entry: 'src/index.node.ts' },
        tsconfig: 'tsconfig.node.json',
        clean: true,
    },

    // Browser 엔트리 (라이브러리)
    {
        entry: { 'index.browser': 'src/index.browser.ts' },
        format: ['esm'],
        platform: 'browser',
        target: 'es2020',
        outDir: 'dist',
        dts: { entry: 'src/index.browser.ts' },
        tsconfig: 'tsconfig.browser.json',
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

    // CLI (Node 전용, CJS)
    {
        entry: { cli: 'src/cli.ts' },
        format: ['cjs'], // ★ CJS로 빌드
        platform: 'node',
        target: 'node18',
        outDir: 'dist',
        splitting: false,
        // 소스 첫 줄에 shebang이 없다면 아래 주석 해제
        // banner: { js: '#!/usr/bin/env node' },
        external: ['postcss', 'postcss-safe-parser', 'chokidar'],
        tsconfig: 'tsconfig.node.json',
        clean: false,
        outExtension: ({ format }) => ({
            js: format === 'cjs' ? '.cjs' : '.js',
        }),
    },
]);
