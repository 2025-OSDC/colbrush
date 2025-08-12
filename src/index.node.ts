// Node 전용 공개 엔트리
export { applyThemes } from './node/applyThemes.js';

// 타입도 필요하면 re-export
export type {} from /* ThemeGenInput 등 필요하면 여기서 */ './node/applyThemes.ts';
