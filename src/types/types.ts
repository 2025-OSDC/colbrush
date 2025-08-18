export type Vision =
    | 'protanopia' // 적색맹 (빨강 계열 인식 불가)
    | 'deuteranopia' // 녹색맹 (초록 계열 인식 불가)
    | 'tritanopia'; // 청색맹 (파랑 계열 인식 불가)

export interface ThemeGenInput {
    vision: Vision;
    variables: VariableInput;
}

export type VariableInput = Record<string, VariableRich>;

export type Flags = Record<string, string | boolean | string[]> & {
    _: string[];
};

export interface VariableRich {
    base: string; // HEX
    scale: boolean; // true=스케일 생성, false=단일 변수
    keys?: string[]; // 스케일 키셋(선택)
    anchor?: string; // "500" 등 (현재 로직에선 anchor는 참고용)
}

export type ThemeType = Vision | 'default';

export interface ThemeGenInput {
    vision: Vision; // 색각 유형
    variables: VariableInput; // {"--primary-500":"#dd3f21", "--accent":{base:"#0088ff", scale:false}}
}

export type ScaleKeys =
    | '50'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';

export type Scale = Record<ScaleKeys, string>;

export interface ColorTransformOutput {
    themes: ThemeGenInput[];
}

// 색상 변환 알고리즘 인터페이스
export interface ColorTransformAlgorithm {
    transformColors(originalColors: VariableInput): Promise<ColorTransformOutput>;
}