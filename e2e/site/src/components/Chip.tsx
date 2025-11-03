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
export default Chip;
