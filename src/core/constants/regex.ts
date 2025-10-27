export const variableRegex =
    /(--color-[\w-]+):\s*([#a-fA-F0-9]{3,8}|(?:oklch|lab|rgb|hsl)\([^)]+\))/g;
export const variationRegex =
    /^--(.+?)-(50|100|200|300|400|500|600|700|800|900)$/i;
