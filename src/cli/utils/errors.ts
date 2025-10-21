// CLI 에러 생성 함수
export function createCLIError(message: string, code: number, suggestions: string[]): Error {
    const error = new Error(`${message}\n\nSuggestions:\n${suggestions.map(s => `  • ${s}`).join('\n')}`);
    (error as any).code = code;
    return error;
}