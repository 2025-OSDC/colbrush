import { useTheme } from 'colbrush/client';
import StatusRow from './StatusRow';

function ThemeStatus() {
    const { theme, language, simulationFilter } = useTheme();

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
                <StatusRow
                    label="Simulation filter"
                    value={simulationFilter}
                    testId="active-simulation-filter"
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
export default ThemeStatus;
