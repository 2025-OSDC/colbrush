import Chip from './Chip';

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
        <div className="flex flex-col gap-3 rounded-2xl border border-white/20 bg-white/8 px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.35)] transition hover:border-white/30 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                {label}
            </dt>
            <dd className="text-base font-semibold text-white sm:text-right">
                <Chip testId={testId}>{value}</Chip>
            </dd>
        </div>
    );
}
export default StatusRow;
