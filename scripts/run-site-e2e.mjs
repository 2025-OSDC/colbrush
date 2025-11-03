#!/usr/bin/env node
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import fs from 'node:fs';
import { readFileSync, writeFileSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, '../e2e/site');
const host = '127.0.0.1';
const port = 4173;
const pidFile = path.resolve(siteDir, '../test-results/vite-dev.pid');

function checkServer() {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port }, () => {
            socket.end();
            resolve(true);
        });
        socket.on('error', () => {
            socket.destroy();
            resolve(false);
        });
        socket.setTimeout(500, () => {
            socket.destroy();
            resolve(false);
        });
    });
}

async function waitForServer(timeoutMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        if (await checkServer()) {
            return;
        }
        await sleep(300);
    }
    throw new Error('개발 서버가 예상 시간 내에 준비되지 않았습니다.');
}

function existingPid() {
    if (!fs.existsSync(pidFile)) return null;
    try {
        const pid = Number(readFileSync(pidFile, 'utf8').trim());
        if (!Number.isFinite(pid)) return null;
        process.kill(pid, 0);
        return pid;
    } catch {
        return null;
    }
}

async function stopExistingServer() {
    const pid = existingPid();

    if (!pid) {
        if (fs.existsSync(pidFile)) {
            fs.rmSync(pidFile, { force: true });
        }

        if (await checkServer()) {
            throw new Error(
                `포트 ${port}에서 실행 중인 프로세스를 종료하지 못했습니다. 수동으로 종료 후 다시 실행해주세요.`
            );
        }
        return;
    }

    console.log(`🛑 기존 E2E 사이트 서버를 종료합니다. (PID ${pid})`);

    try {
        process.kill(pid, 'SIGTERM');
    } catch (error) {
        if (error?.code === 'ESRCH') {
            fs.rmSync(pidFile, { force: true });
            return;
        }
        throw error;
    }

    const gracefulDeadline = Date.now() + 5000;
    while (await checkServer()) {
        if (Date.now() > gracefulDeadline) {
            console.log('⚠️ 정상 종료되지 않아 강제 종료합니다.');
            try {
                process.kill(pid, 'SIGKILL');
            } catch (error) {
                if (error?.code !== 'ESRCH') {
                    throw error;
                }
            }
            break;
        }
        await sleep(200);
    }

    const serverStillRunning = await checkServer();
    fs.rmSync(pidFile, { force: true });

    if (serverStillRunning) {
        throw new Error(
            `기존 E2E 사이트 서버(PID ${pid})를 종료하지 못했습니다.`
        );
    }

    console.log('✅ 기존 E2E 사이트 서버를 종료했습니다.');
}

async function ensureServer() {
    if (await checkServer()) {
        await stopExistingServer();
    }

    const viteBin = path.resolve(siteDir, 'node_modules/vite/bin/vite.js');
    if (!fs.existsSync(viteBin)) {
        console.log('📦 e2e 사이트 의존성을 설치합니다...');
        await new Promise((resolve, reject) => {
            const child = spawn('pnpm', ['install'], {
                cwd: siteDir,
                stdio: 'inherit',
            });
            child.on('exit', (code) => {
                if (code === 0) resolve();
                else reject(new Error('pnpm install 실패'));
            });
            child.on('error', reject);
        });
    }

    console.log('🚀 E2E 사이트 서버를 시작합니다...');
    const devProcess = spawn(
        process.execPath,
        [viteBin, 'dev', '--host', host, '--port', String(port)],
        {
            cwd: siteDir,
            stdio: 'ignore',
            detached: true,
        }
    );
    devProcess.unref();
    fs.mkdirSync(path.dirname(pidFile), { recursive: true });
    writeFileSync(pidFile, String(devProcess.pid));

    await waitForServer();
    console.log(
        `🌐 ${`http://${host}:${port}`} 서버가 준비되었습니다. (PID ${devProcess.pid})`
    );
    return true;
}

async function runPlaywright() {
    return new Promise((resolve, reject) => {
        const child = spawn('pnpm', ['exec', 'playwright', 'test'], {
            cwd: siteDir,
            stdio: 'inherit',
            env: {
                ...process.env,
                PLAYWRIGHT_EXTERNAL_SERVER: '1',
            },
        });

        child.on('exit', (code) => resolve(code ?? 1));
        child.on('error', reject);
    });
}

async function main() {
    const startedServer = await ensureServer();
    const exitCode = await runPlaywright();

    if (exitCode !== 0) {
        process.exit(exitCode);
    }

    if (startedServer) {
        console.log('ℹ️  테스트가 끝났습니다. 서버는 계속 실행됩니다.');
    }
}

main().catch((error) => {
    console.error('❌ 테스트 실행 중 오류가 발생했습니다.', error);
    process.exit(1);
});
