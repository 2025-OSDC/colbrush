// HEX → RGB 변환
export function hexToRgb(hex: string): [number, number, number] | null {
    let clean = hex.replace('#', '').toLowerCase();
    if (clean.length === 3) {
        clean = clean
            .split('')
            .map((c) => c + c)
            .join('');
    }
    if (clean.length !== 6) return null;

    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return [r, g, b];
}

// 무채색 판별: R,G,B 값이 완전히 같을 때만 true
export function isNeutralColor(value: string): boolean {
    const rgb = hexToRgb(value);
    if (!rgb) return false;

    const [r, g, b] = rgb;
    return r === g && g === b;
}

// 흑백 색상 감지 함수
function isBlackOrWhite(hexColor: string): boolean {
    const hex = hexColor.toLowerCase().replace('#', '');
    const fullHex =
        hex.length === 3
            ? hex
                  .split('')
                  .map((char) => char + char)
                  .join('')
            : hex;

    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    const isWhite = r >= 250 && g >= 250 && b >= 250;
    const isBlack = r <= 10 && g <= 10 && b <= 10;

    return isWhite || isBlack;
}

// scale 값 계산 함수
export function calculateScale(varName: string, hexColor: string): boolean {
    if (isBlackOrWhite(hexColor)) {
        return false;
    }

    return /\d+$/.test(varName);
}