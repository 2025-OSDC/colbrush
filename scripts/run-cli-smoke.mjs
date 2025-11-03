#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const siteCss = path.join(repoRoot, 'e2e/site/src/index.css');
const cliEntry = path.join(repoRoot, 'dist/cli.cjs');
const reportPath = path.join(repoRoot, 'test-results/cli-report.json');

function run(command, args, { cwd = repoRoot, env = {} } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd,
            stdio: 'inherit',
            env: { ...process.env, ...env },
        });
        child.on('exit', (code) => {
            if (code === 0) resolve();
            else
                reject(
                    new Error(
                        `${command} ${args.join(' ')} exited with code ${code}`
                    )
                );
        });
        child.on('error', reject);
    });
}

function runColbrush(args, options = {}) {
    return run(process.execPath, [cliEntry, ...args], options);
}

async function runGenerateOnSiteCss() {
    await mkdir(path.dirname(reportPath), { recursive: true });

    await runColbrush(['generate', `--css=${siteCss}`, `--json=${reportPath}`]);

    const generatedCss = await readFile(siteCss, 'utf8');
    if (!generatedCss.includes("[data-theme='protanopia']")) {
        throw new Error(
            '생성된 CSS에서 protanopia 테마 블록을 찾을 수 없습니다.'
        );
    }
    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    if (report.exitCode !== 0) {
        throw new Error('CLI JSON 리포트가 성공 상태를 반환하지 않았습니다.');
    }
}

async function main() {
    console.log('🛠️ CLI 테스트를 준비 중입니다...\n');

    await runColbrush(['--version']);
    await runColbrush(['--help']);
    await runColbrush(['--doctor']);

    console.log(
        '\n🚧 실제 e2e 사이트 CSS에 대해 colbrush generate 명령을 검증합니다...\n'
    );
    await runGenerateOnSiteCss();
    console.log('\n✅ colbrush CLI 기본 명령들이 정상적으로 동작했습니다.');
}

main().catch((error) => {
    console.error('❌ CLI 테스트가 실패했습니다.', error);
    process.exit(1);
});
