import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const cliEntry = path.join(repoRoot, 'dist/cli.cjs');
const fixtureCss = path.join(repoRoot, 'e2e/site/src/index.css');
const packageVersion = JSON.parse(
    readFileSync(path.join(repoRoot, 'package.json'), 'utf8')
).version;

const sandboxes = [];

const runProcess = (command, args, options = {}) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: options.cwd ?? repoRoot,
            env: { ...process.env, ...options.env },
            stdio: options.inheritStdio ? 'inherit' : 'pipe',
        });

        if (options.inheritStdio) {
            child.on('exit', (code) => {
                resolve({ code, stdout: '', stderr: '' });
            });
            child.on('error', reject);
            return;
        }

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        child.on('exit', (code) => {
            resolve({ code, stdout, stderr });
        });
        child.on('error', reject);
    });

before(async () => {
    console.log('🛠️ 라이브러리 빌드를 준비 중입니다...\n');
    const buildResult = await runProcess('pnpm', ['build'], {
        inheritStdio: true,
    });
    if (buildResult.code !== 0) {
        throw new Error('Failed to build library before CLI tests');
    }
    console.log('\n✅ 라이브러리 빌드 완료\n');
});

after(async () => {
    await Promise.all(
        sandboxes.map((dir) => rm(dir, { recursive: true, force: true }))
    );
});

async function createSandbox() {
    const sandboxRoot = await mkdtemp(path.join(tmpdir(), 'colbrush-cli-'));
    const targetCssPath = path.join(sandboxRoot, 'input.css');
    await cp(fixtureCss, targetCssPath);
    sandboxes.push(sandboxRoot);
    return { sandboxRoot, cssPath: targetCssPath };
}

async function runCli(args, options) {
    return runProcess(process.execPath, [cliEntry, ...args], options);
}

test('prints version information with --version flag', async () => {
    const result = await runCli(['--version']);

    assert.equal(result.code, 0);
    assert.ok(
        result.stdout.includes(`Colbrush v${packageVersion}`),
        `CLI stdout should contain version banner, got: ${result.stdout}`
    );
});

test('displays usage instructions with --help', async () => {
    const result = await runCli(['--help']);

    assert.equal(result.code, 0);
    const normalized = result.stdout.replace(/\u001B\[[0-9;]*m/g, '');
    assert.ok(
        normalized.includes('USAGE'),
        '도움말에는 "USAGE" 섹션이 포함되어야 합니다'
    );
    assert.ok(
        normalized.includes('Generate color-blind accessible themes'),
        '도움말에는 generate 명령 설명이 포함되어야 합니다'
    );
});

test('generates themed CSS and report for a valid input file', async () => {
    const { sandboxRoot, cssPath } = await createSandbox();
    const reportPath = path.join(sandboxRoot, 'report.json');

    const result = await runCli(
        ['generate', `--css=${cssPath}`, `--json=${reportPath}`],
        { cwd: sandboxRoot }
    );

    assert.equal(
        result.code,
        0,
        `CLI exited with non-zero code: ${result.stderr}`
    );
    assert.ok(
        result.stdout.includes('All themes generated successfully'),
        'CLI는 성공적으로 완료되었다는 메시지를 출력해야 합니다'
    );

    const cssOutput = await readFile(cssPath, 'utf8');
    assert.match(
        cssOutput,
        /\[data-theme='protanopia']\s*{[\s\S]+--color-primary-500:/,
        'CSS file should contain the protanopia theme block'
    );
    assert.match(
        cssOutput,
        /\[data-theme='deuteranopia']\s*{[\s\S]+--color-primary-500:/,
        'CSS file should contain the deuteranopia theme block'
    );
    assert.match(
        cssOutput,
        /\[data-theme='tritanopia']\s*{[\s\S]+--color-primary-500:/,
        'CSS file should contain the tritanopia theme block'
    );

    const jsonReportRaw = await readFile(reportPath, 'utf8');
    const jsonReport = JSON.parse(jsonReportRaw);

    assert.equal(jsonReport.input, cssPath);
    assert.equal(jsonReport.exitCode, 0);
    assert.equal(jsonReport.themes.length, 3);
    assert.ok(
        jsonReport.variables.processed >= 4,
        `Expected at least 4 processed variables, got ${jsonReport.variables.processed}`
    );
});
