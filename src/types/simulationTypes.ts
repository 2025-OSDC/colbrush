import { TPosition } from '../core/constants/position.js';
import { VisionMode } from '../core/types.js';

export interface VisionOptions {
    /** 기본 모드. 기본값 'none' */
    defaultMode?: VisionMode;
    /** localStorage 키, 기본값 'colbrush-filter' */
    storageKey?: string;
    /** 개발 호스트 허용(정규식) — 기본: localhost/127/192.168.x */
    devHostPattern?: RegExp;
    /** 툴바 위치, 기본 'left-bottom' */
    position?: TPosition;
    /** 프로덕션에서도 강제로 허용(디버깅용). 기본 false */
    allowInProd?: boolean;
}

export type Controller = {
    getMode(): VisionMode;
    setMode(mode: VisionMode): void;
    toggle(on?: boolean): void;
    destroy(): void;
    subscribe(listener: (mode: VisionMode) => void): () => void;
};

export type Position = NonNullable<VisionOptions['position']>;

export interface ResolvedOptions {
    defaultMode: VisionMode;
    storageKey: string;
    devHostPattern?: RegExp;
    position: Position;
    allowInProd: boolean;
}
export { VisionMode };
