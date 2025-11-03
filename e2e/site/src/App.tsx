import { ThemeProvider, ThemeSwitcher } from 'colbrush/client';
import React from 'react';
import { SimulationFilter } from 'colbrush/devtools';
import { DeuteranopiaTest } from './components/DeuteranopiaTest';
import { ProtanopiaTest } from './components/ProtanopiaTest';
import { TritanopiaTest } from './components/TritanopiaTest';
import ThemeStatus from './components/ThemeStatus';
import TestWrapper from './components/TestWrapper';

export default function App() {
    const tests = [
        {
            key: 'protanopia',
            title: '적색맹 테스트',
            badge: 'Protanopia',
            description:
                '붉은 계열이 약해진 시력을 가정하고 UI 대비와 원형 패턴을 점검합니다.',
            render: () => <ProtanopiaTest className="h-full w-full" />,
        },
        {
            key: 'deuteranopia',
            title: '녹색맹 테스트',
            badge: 'Deuteranopia',
            description:
                '녹색 인식이 제한된 사용자가 볼 때 색상 층위가 유지되는지 확인하세요.',
            render: () => <DeuteranopiaTest className="h-full w-full" />,
        },
        {
            key: 'tritanopia',
            title: '청색맹 테스트',
            badge: 'Tritanopia',
            description:
                '청색과 노란색을 구분하기 어려운 환경에서 주요 정보가 유지되는지 살펴봅니다.',
            render: () => <TritanopiaTest className="h-full w-full" />,
        },
    ] as const;
    const usageTips = [
        {
            title: '테마와 언어 확인',
            detail: '오른쪽 하단 Theme Switcher로 테마 · 언어를 토글하면 컨텍스트가 즉시 갱신됩니다.',
        },
        {
            title: '시뮬레이션 필터 적용',
            detail: 'Vision Simulation 툴바에서 모드를 선택하면 자동으로 SVG 테스트 카드에 필터가 적용됩니다.',
        },
        {
            title: '현재 상태 추적',
            detail: '좌측 상태 패널에서 theme, language, simulation filter 값이 기대와 일치하는지 확인하세요.',
        },
        {
            title: 'E2E 스냅샷',
            detail: '각 카드 하단 설명을 참고해 스크린샷 또는 스냅샷 테스트 포인트를 빠르게 파악할 수 있습니다.',
        },
    ] as const;

    return (
        <ThemeProvider>
            <ThemeSwitcher />
            <SimulationFilter />
            <main className="relative min-h-svh w-full overflow-hidden bg-[radial-gradient(140%_140%_at_0%_0%,rgba(56,189,248,0.12),transparent_55%),radial-gradient(140%_140%_at_100%_100%,rgba(99,102,241,0.22),transparent_60%)] px-6 py-12 text-white sm:px-10 lg:px-12">
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl [background:conic-gradient(at_20%_20%,rgba(59,130,246,0.35),rgba(99,102,241,0.15),transparent_70%)]" />

                <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
                    <section className="grid gap-10 lg:grid-cols-[minmax(320px,1fr)_minmax(0,1.8fr)]">
                        <aside className="flex flex-col gap-6 lg:sticky lg:top-12 lg:self-start">
                            <ThemeStatus />
                        </aside>

                        <div className="space-y-6">
                            <div className="grid gap-6 grid-cols-3">
                                {tests.map((test) => (
                                    <TestWrapper
                                        key={test.key}
                                        title={test.title}
                                        description={test.description}
                                        badge={test.badge}
                                    >
                                        {test.render()}
                                    </TestWrapper>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </ThemeProvider>
    );
}
