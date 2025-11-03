import { ThemeProvider, ThemeSwitcher, useTheme } from 'colbrush/client';
import React from 'react';
import { SimulationFilter } from 'colbrush/devtools';
import { DeuteranopiaTest } from './components/DeuteranopiaTest';
import { ProtanopiaTest } from './components/ProtanopiaTest';
import { TritanopiaTest } from './components/TritanopiaTest';
import ThemeStatus from './components/ThemeStatus';
import TestWrapper from './components/TestWrapper';

export default function App() {
    return (
        <ThemeProvider>
            <ThemeSwitcher />
            <SimulationFilter />
            <main className="relative min-h-svh w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.25),transparent_40%)] p-6 text-white">
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 blur-3xl [background:conic-gradient(from_180deg_at_50%_50%,--theme(--color-sky-400/.3),--theme(--color-indigo-500/.3),transparent_70%)]" />

                <div className="mx-auto flex flex-col max-w-5xl items-start gap-6 lg:grid-cols-[1fr_min(380px,40%)]">
                    <ThemeStatus />
                    <div className="flex w-full gap-2 self-center items-center">
                        <TestWrapper title="적색맹 테스트">
                            <ProtanopiaTest />
                        </TestWrapper>
                        <TestWrapper title="녹색맹 테스트">
                            <DeuteranopiaTest />
                        </TestWrapper>
                        <TestWrapper title="청색맹 테스트">
                            <TritanopiaTest />
                        </TestWrapper>
                    </div>
                </div>
            </main>
        </ThemeProvider>
    );
}
