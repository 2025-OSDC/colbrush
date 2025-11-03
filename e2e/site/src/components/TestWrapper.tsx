export default function TestWrapper({
    children,
    title,
    description,
    badge = 'Vision Simulation',
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
    badge?: string;
}) {
    return (
        <section
            className="relative flex h-full flex-col gap-5 rounded-3xl border border-white/15 bg-[#0f172a]/80 p-6 text-white shadow-[0_18px_48px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-all duration-200 hover:border-white/25"
            aria-live="polite"
        >
            <header className="space-y-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                    {badge}
                </span>
                {title && (
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        {title}
                    </h2>
                )}
            </header>

            <figure className="flex min-h-[220px] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <div className="grid h-full w-full place-items-center text-white">
                    {children}
                </div>
            </figure>

            {description && (
                <p className="text-sm leading-relaxed text-white/92">
                    {description}
                </p>
            )}
        </section>
    );
}
