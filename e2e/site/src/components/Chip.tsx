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
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-semibold text-[#0b1729] shadow-[0_8px_20px_rgba(15,23,42,0.25)] transition-colors duration-200 hover:bg-white/90"
        >
            {children}
        </span>
    );
}
export default Chip;
