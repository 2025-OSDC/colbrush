export type VisionMode = 'deuteranopia' | 'protanopia' | 'tritanopia' | 'none';

export interface VisionOptions {
    /** 기본 모드. 기본값 'none' */
    defaultMode?: VisionMode;
    /** URL 토글 파라미터 키 (예: ?vision=deut), 기본값 'vision' */
    paramKey?: string;
    /** localStorage 키, 기본값 'colbrush:vision' */
    storageKey?: string;
    /** 개발 호스트 허용(정규식) — 기본: localhost/127/192.168.x */
    devHostPattern?: RegExp;
    /** 툴바 위치, 기본 'left-bottom' */
    toolbarPosition?: 'left-bottom' | 'right-bottom' | 'left-top' | 'right-top';
    /** 단축키 활성 여부, 기본 true (⌘/Ctrl + Alt + D) */
    hotkey?: boolean;
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

export type ToolbarPosition = NonNullable<VisionOptions['toolbarPosition']>;

export interface ResolvedOptions {
    defaultMode: VisionMode;
    paramKey: string;
    storageKey: string;
    devHostPattern?: RegExp;
    toolbarPosition: ToolbarPosition;
    hotkey: boolean;
    allowInProd: boolean;
}
