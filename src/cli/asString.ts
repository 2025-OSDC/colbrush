export default function asString(v: unknown, fallback: string): string {
    return typeof v === 'string' ? v : fallback;
}
