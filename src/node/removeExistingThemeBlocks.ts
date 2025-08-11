import { Vision } from '../types/types';

export function removeExistingThemeBlocks(content: string): string {
    const visions = [
        'protanopia',
        'deuteranopia',
        'tritanopia',
        'achromatopsia',
    ];
    let cleaned = content;
    for (const vision of visions) {
        const pattern = new RegExp(
            `\\/\\*\\s*${vision} theme start\\s*\\*\\/[^]*?\\/\\*\\s*${vision} theme end\\s*\\*\\/`,
            'gm'
        );
        cleaned = cleaned.replace(pattern, '');
    }
    return cleaned.trim();
}
