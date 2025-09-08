import type { Flags } from '../core/types.js';

export default function parseFlags(
    argv: readonly string[] = process.argv.slice(2)
): Flags {
    const out: Flags = { _: [] };
    for (const s of argv) {
        const m = /^--([^=]+)=(.*)$/.exec(s);
        if (m) out[m[1]] = m[2];
        else if (s.startsWith('--')) out[s.slice(2)] = true;
        else out._.push(s);
    }
    return out;
}
