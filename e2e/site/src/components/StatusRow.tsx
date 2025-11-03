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
        <div className="flex items-center justify-between gap-4 rounded-xl bg-white/3 p-3 ring-1 ring-white/10">
            <dt className="text-sm font-medium text-white/80">{label}</dt>
            <dd className="text-right">
                <Chip testId={testId}>{value}</Chip>
            </dd>
        </div>
    );
}
export default StatusRow;
