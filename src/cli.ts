#!/usr/bin/env node
import fs from 'node:fs';
import { applyThemes } from './node/applyThemes.js';

type Vision = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
type VariableInput = Record<
    string,
    string | { base: string; scale: boolean; keys?: string[]; anchor?: string }
>;
interface ThemeGenInput {
    vision: Vision;
    theme: string;
    variables: VariableInput;
}

const DEFAULT_PAYLOAD: { themes: ThemeGenInput[] } = {
    themes: [
        {
            vision: 'deuteranopia',
            theme: 'deuteranopia',
            variables: {
                '--color-primary-500': '#7fe4c1',
                '--color-secondary-yellow': '#fdfa91',
                '--color-secondary-blue': '#005880',
                '--color-default-gray-500': '#c3c3c3',
            },
        },
    ],
};

type Flags = Record<string, string | boolean | string[]> & { _: string[] };

function parseFlags(argv: readonly string[] = process.argv.slice(2)): Flags {
    const out: Flags = { _: [] };
    for (const s of argv) {
        const m = /^--([^=]+)=(.*)$/.exec(s);
        if (m) out[m[1]] = m[2];
        else if (s.startsWith('--')) out[s.slice(2)] = true;
        else out._.push(s);
    }
    return out;
}

function asString(v: unknown, fallback: string): string {
    return typeof v === 'string' ? v : fallback;
}

function loadPayload(configPath?: string, useDefault?: boolean) {
    if (useDefault) return DEFAULT_PAYLOAD;
    if (!configPath || !fs.existsSync(configPath)) {
        throw new Error(
            `Config not found: ${configPath}. (use --use-default to use built-in sample)`
        );
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

async function runOnce(
    configPath: string,
    cssPath: string,
    useDefault: boolean
) {
    const payload = loadPayload(configPath, useDefault);
    const inputs = Array.isArray(payload?.themes)
        ? payload.themes
        : Array.isArray(payload)
        ? payload
        : [payload];
    for (const input of inputs) await applyThemes(input, cssPath);
    console.log(`✅ applied ${inputs.length} theme(s) to ${cssPath}`);
}

async function main() {
    const flags = parseFlags();
    const cmd = (flags._[0] ?? 'apply') as 'init' | 'apply' | 'watch';

    const config = asString(flags.config, 'cb.theme.json');
    const css = asString(flags.css, 'src/index.css');
    const useDefault = !!flags['use-default'];

    if (cmd === 'init') {
        if (!fs.existsSync(config)) {
            fs.writeFileSync(config, JSON.stringify(DEFAULT_PAYLOAD, null, 2));
            console.log(`✅ created ${config}`);
        } else {
            console.log(`ℹ️ ${config} already exists`);
        }
        process.exit(0);
    }

    if (cmd === 'apply') {
        await runOnce(config, css, useDefault);
        process.exit(0);
    }

    if (cmd === 'watch') {
        const { default: chokidar } = await import('chokidar');
        const react = async () => await runOnce(config, css, useDefault);
        await react();
        chokidar.watch(config, { ignoreInitial: true }).on('all', react);
        return;
    }

    console.log(`Usage:
  cb-theme init
  cb-theme apply --config=cb.theme.json --css=src/index.css
  cb-theme apply --use-default --css=src/index.css
  cb-theme watch --config=cb.theme.json --css=src/index.css
  cb-theme watch --use-default --css=src/index.css`);
    process.exit(1);
}

main().catch((e) => {
    console.error('❌ CLI failed:', e);
    process.exit(1);
});
