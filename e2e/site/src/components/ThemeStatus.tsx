import { useTheme } from 'colbrush/client';
import StatusRow from './StatusRow';

function ThemeStatus() {
    const { theme, language, simulationFilter } = useTheme();

    return (
        <section
            className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-[#0b1220]/90 p-8 text-white shadow-[0_22px_60px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
            aria-live="polite"
        >
            <header className="mb-8 flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white">
                        Context
                    </span>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            Colbrush E2E Playground
                        </h1>
                        <p className="mt-2 text-sm text-white/80">
                            ThemeProvider가 노출하는 현재 컨텍스트 값을 실시간으로
                            확인하세요.
                        </p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100 shadow-inner shadow-emerald-500/20">
                    Live
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(134,239,172,0.9)]" />
                </span>
            </header>

            <dl className="grid gap-4">
                <StatusRow
                    label="Active theme"
                    value={theme}
                    testId="active-theme"
                />
                <StatusRow
                    label="Language"
                    value={language}
                    testId="active-language"
                />
                <StatusRow
                    label="Simulation filter"
                    value={simulationFilter}
                    testId="active-simulation-filter"
                />
            </dl>

            <p className="mt-8 text-sm leading-relaxed text-white/85">
                Theme Switcher 또는 Simulation Filter에서 옵션을 변경할 때마다
                본 카드의 값이 즉시 갱신되어 E2E 테스트의 단일 기준점 역할을 합니다.
                값이 예상과 다르면 전역 상태 또는 포털 위치를 먼저 점검하세요.
            </p>
        </section>
    );
}
export default ThemeStatus;
