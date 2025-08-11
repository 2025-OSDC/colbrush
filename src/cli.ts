#!/usr/bin/env node
import parseFlags from './node/parseFlags.js';
import { runThemeApply } from './node/runThemeApply.js';

async function main() {
    const flags = parseFlags();
    const cmd = (flags._[0] ?? 'generate') as 'generate';
    const cssPath = typeof flags.css === 'string' ? flags.css : 'src/index.css';

    if (cmd === 'generate') {
        await runThemeApply(cssPath);
        process.exit(0);
    }

    console.log(`사용 방법:
    - cb-theme generate [--css=src/index.css]
        CSS 파일에서 색상 변수들을 추출하고, 색맹 테마를 자동 생성하여 같은 CSS 파일에 적용합니다.
        (기본 경로는 src/index.css)
`);
    process.exit(1);
}

main().catch((e) => {
    console.error('❌ CLI failed:', e);
    process.exit(1);
});
