export interface ProgressReporter {
    // 세분화 모드: 섹션(파트) 단위 진행
    startSection(name: string): void;
    update(percent: number, label?: string): void; // 0..100
    finishSection(label?: string): void;

    // 하위 호환 (단일 바 모드)
    start?(totalHint?: number, label?: string): void;
    finish?(label?: string): void;
}

function clampPercent(n: number) {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
}

export function createCliProgress(): ProgressReporter {
    // ---- 상태 ----
    let hasAnyOutput = false;
    let currentSection: string | null = null;
    let sectionStartedAt = 0;

    const isTTY = !!process.stdout.isTTY;
    const A = {
        reset: '\x1b[0m', // 리셋
        bold: '\x1b[1m', // 굵게
        dim: '\x1b[2m', // 흐리게
        green: '\x1b[32m', // 초록
        cyan: '\x1b[36m', // 청록
        clearLine: '\x1b[2K', // 줄 지우기
        carriage: '\r', // 캐리지 리턴
    } as const;

    const style = (code: string, text: string) =>
        isTTY ? `${code}${text}${A.reset}` : text;
    const bold = (t: string) => style(A.bold, t);
    const dim = (t: string) => style(A.dim, t);
    const green = (t: string) => style(A.green, t);
    const cyan = (t: string) => style(A.cyan, t);

    // ---- 출력 유틸 ----
    function writeSameLine(text: string) {
        if (isTTY) {
            process.stdout.write(A.clearLine + A.carriage + text);
        } else {
            console.log(text);
        }
        hasAnyOutput = true;
    }

    function newline() {
        if (hasAnyOutput) process.stdout.write('\n');
    }

    // ---- 렌더링 ----
    function getTerminalColumns(): number {
        const c =
            typeof process.stdout.columns === 'number'
                ? process.stdout.columns
                : 80;
        return Math.max(40, c); // 너무 좁은 환경 보호
    }

    function renderBar(pct: number): string {
        const columns = getTerminalColumns();
        // 바 폭을 터미널 폭 기준으로 산출(최소 12, 최대 30)
        const width = Math.max(12, Math.min(30, Math.floor(columns * 0.3)));
        const filled = Math.round((pct / 100) * width);
        const fillChar = '█';
        const emptyChar = '░';
        const body = fillChar.repeat(filled) + emptyChar.repeat(width - filled);
        // 100%면 초록, 그 외엔 청록
        return pct >= 100 ? green(body) : cyan(body);
    }

    function render(
        pctRaw: number,
        suffixLabel?: string,
        opts?: { styledSuffix?: boolean }
    ) {
        const p = clampPercent(pctRaw);
        const name = currentSection ? bold(currentSection) : '';
        const bar = renderBar(p);
        const percentText = bold(`${p.toFixed(0).padStart(3, ' ')}%`);

        // 접두사: TTY면 '› ' 표시
        const prefix = isTTY
            ? `${cyan('›')} ${name ? name + ' ' : ''}`
            : name
              ? name + ' '
              : '';

        // 접미사 라벨
        const suffix = suffixLabel
            ? ` ${opts?.styledSuffix ? suffixLabel : dim(suffixLabel)}`
            : '';

        writeSameLine(`${prefix}[${bar}] ${percentText}${suffix}`);
    }

    return {
        startSection(name: string) {
            // 섹션 전환 시 줄 바꿈 한 번
            if (currentSection) newline();
            currentSection = name;
            sectionStartedAt = Date.now();
            render(0);
        },

        update(percent, label) {
            // 섹션 없이 update가 들어올 수 있으니 방어
            if (!currentSection) {
                currentSection = '';
                sectionStartedAt = Date.now();
            }
            render(percent, label);
        },

        finishSection() {
            if (!currentSection) return;

            const ms = Date.now() - sectionStartedAt;
            const secText = (ms / 1000).toFixed(1) + 's';

            // 완료 메시지: 체크는 초록, 시간은 흐리게
            const doneStyled = `${green('✔ Done')} ${dim(`(${secText})`)}`;
            render(100, doneStyled, { styledSuffix: true });
            newline();
            process.stdout.write('\n\n');
            currentSection = null;
        },

        // 하위 호환: 단일 바를 하나의 섹션처럼 취급
        start(_totalHint, label) {
            this.startSection(label ?? '');
        },
        finish(label) {
            this.finishSection(label);
        },
    };
}
