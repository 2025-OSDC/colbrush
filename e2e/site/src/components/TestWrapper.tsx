export default function TestWrapper({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <section
            className="w-full flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur-xl ring-1 ring-white/15 dark:bg-black/30"
            aria-live="polite"
        >
            {children}
            <span className="w-fit self-center items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-sm font-medium tracking-tight text-white/90 shadow-sm backdrop-blur transition hover:bg-white/10 dark:text-white/90">
                {title}
            </span>
        </section>
    );
}
