#!/usr/bin/env node
/// <reference types="node" />
import parseFlags from './parseFlags.js';
import { runThemeApply } from './runThemeApply.js';
import { createCliProgress } from './progress.js';

async function main() {
    const flags = parseFlags();
    const cmd = (flags._[0] ?? 'generate') as 'generate';
    const cssPath = typeof flags.css === 'string' ? flags.css : 'src/index.css';

    if (cmd === 'generate') {
        const progress = createCliProgress();
        await runThemeApply(cssPath, progress);
        process.exit(0);
    }

    console.log(`Usage:
    - colbrush generate [--css=src/index.css]
        Extracts color variables from the CSS file and automatically generates color-blind themes,
        then applies them to the same CSS file.
        (Default path: src/index.css)
`);

    process.exit(1);
}

main().catch((e) => {
    console.error('❌ CLI failed:', e);
    process.exit(1);
});
