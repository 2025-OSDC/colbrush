import { defineConfig } from 'tsup';
import svgr from 'esbuild-plugin-svgr';
import svgrPlugin from 'esbuild-plugin-svgr';
export default defineConfig([
    // Browser 엔트리 (라이브러리)
    {
        entry: { 'index.browser': 'src/index.browser.ts' },
        format: ['esm'],
        platform: 'browser',
        target: 'es2020',
        esbuildPlugins: [
            svgr({
                exportType: 'default',
                svgo: true,
                ref: true,
            }),
        ],
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
        loader: {
            '.svg': 'dataurl',
        },
    },

    {
        entry: { cli: 'src/cli.ts' },
        format: ['cjs'], // ★ CJS로 빌드
        platform: 'node',
        target: 'node18',
        outDir: 'dist',
        splitting: false,
        external: ['postcss', 'postcss-safe-parser', 'chokidar'],
        tsconfig: 'tsconfig.node.json',
        clean: false,
        outExtension: ({ format }) => ({
            js: format === 'cjs' ? '.cjs' : '.js',
        }),
    },
]);
