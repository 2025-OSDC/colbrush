#!/usr/bin/env node
import parseFlags from './node/parseFlags.js';
import { runThemeApply } from './node/runThemeApply.js';

async function main() {
    const flags = parseFlags();
    const cmd = (flags._[0] ?? 'apply') as 'watch' | 'generate';
    const cssPath = typeof flags.css === 'string' ? flags.css : 'src/index.css';

    if (cmd === 'generate') {
        await runThemeApply(cssPath);
        process.exit(0);
    }

    if (cmd === 'watch') {
        const { default: chokidar } = await import('chokidar');

        const react = async () => {
            try {
                await runThemeApply(cssPath);
            } catch (e) {
                console.error('❌ 적용 중 오류 발생:', e);
            }
        };

        await react();

        // CSS 파일을 감시 대상으로 설정
        chokidar.watch(cssPath, { ignoreInitial: true }).on('change', react);

        return;
    }

    console.log(`사용 방법:
    - cb-theme generate [--css=src/index.css]
        CSS 파일에서 색상 변수들을 추출하고, 색맹 테마를 자동 생성하여 같은 CSS 파일에 적용합니다.
        (기본 경로는 src/index.css)

    - cb-theme watch [--css=src/index.css]
        설정 파일 변경을 감지하여 실시간으로 테마를 적용합니다.
`);
    process.exit(1);
}

main().catch((e) => {
    console.error('❌ CLI failed:', e);
    process.exit(1);
});
