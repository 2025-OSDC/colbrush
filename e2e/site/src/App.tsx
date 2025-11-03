import { ThemeProvider, ThemeSwitcher, useTheme } from 'colbrush/client';
import React from 'react';
import { SimulationFilter } from 'colbrush/devtools';
import { DeuteranopiaTest } from './components/DeuteranopiaTest';
import { ProtanopiaTest } from './components/ProtanopiaTest';
import { TritanopiaTest } from './components/TritanopiaTest';

function Chip({
    children,
    testId,
}: {
    children: React.ReactNode;
    testId?: string;
}) {
    return (
        <span
            data-testid={testId}
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-sm font-medium tracking-tight text-white/90 shadow-sm backdrop-blur transition hover:bg-white/10 dark:text-white/90"
        >
            {children}
        </span>
    );
}

function StatusRow({
    label,
    value,
    testId,
}: {
    label: string;
    value: React.ReactNode;
    testId?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/3 p-3 ring-1 ring-white/10">
            <dt className="text-sm font-medium text-white/80">{label}</dt>
            <dd className="text-right">
                <Chip testId={testId}>{value}</Chip>
            </dd>
        </div>
    );
}

function ThemeStatus() {
    const { theme, language } = useTheme();

    return (
        <section
            className="w-full rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl ring-1 ring-white/15 dark:bg-black/30"
            aria-live="polite"
        >
            <header className="mb-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-sky-400/70 to-indigo-500/70 shadow-md ring-1 ring-white/20" />
                <h1 className="text-xl font-semibold tracking-tight text-white drop-shadow-sm">
                    Colbrush E2E Playground
                </h1>
            </header>

            <dl className="grid grid-cols-1 gap-3">
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
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-white/80">
                Use the floating
                <span className="font-semibold"> Theme Switcher </span> to
                toggle theme and language options. The panel above reflects the
                current context values.
            </p>
        </section>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <ThemeSwitcher />
            <SimulationFilter />
            <main className="relative min-h-svh w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(56,189,248,0.25),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.25),transparent_40%)] p-6 text-white">
                <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 blur-3xl [background:conic-gradient(from_180deg_at_50%_50%,--theme(--color-sky-400/.3),--theme(--color-indigo-500/.3),transparent_70%)]" />

                <div className="mx-auto flex flex-col max-w-5xl items-start gap-6 lg:grid-cols-[1fr_min(380px,40%)]">
                    <ThemeStatus />
                    <div className="flex max-w-[90vw] self-center items-center">
                        <DeuteranopiaTest />
                        <ProtanopiaTest />
                        <TritanopiaTest />
                    </div>
                </div>
            </main>
        </ThemeProvider>
    );
}
