import type { Vision } from '../core/types.js';

export const VISIONS: Vision[] = ['deuteranopia', 'protanopia', 'tritanopia'];

export const VISION_LABELS: Record<Vision, string> = {
    deuteranopia: '💚 Deuteranopia',
    protanopia: '❤️ Protanopia',
    tritanopia: '💙 Tritanopia'
};