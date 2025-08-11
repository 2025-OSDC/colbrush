import fs from 'node:fs';
export default function loadPayload(configPath?: string) {
    if (!configPath || !fs.existsSync(configPath)) {
        throw new Error(
            `Config not found: ${configPath}. (use --use-default to use built-in sample)`
        );
    }
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}
