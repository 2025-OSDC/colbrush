export function removeExistingThemeBlocks(content: string): string {
    const visions = ['protanopia', 'deuteranopia', 'tritanopia'];
    let cleaned = content;
    for (const vision of visions) {
        const pattern = new RegExp(
            `\\[data-theme=['"]${vision}['"]\\][^}]*}\\s*`,
            'gm'
        );
        cleaned = cleaned.replace(pattern, '');
    }
    return cleaned.trim();
}
