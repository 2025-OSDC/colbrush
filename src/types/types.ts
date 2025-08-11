export type Vision =
    | 'protanopia'
    | 'deuteranopia'
    | 'tritanopia'
    | 'achromatopsia';

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
