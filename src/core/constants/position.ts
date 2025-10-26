export type TPosition =
    | 'left-bottom'
    | 'right-bottom'
    | 'left-top'
    | 'right-top';

export const Position: TPosition[] = [
    'left-bottom',
    'right-bottom',
    'left-top',
    'right-top',
];

export const SWITCHER_POSITION: Record<TPosition, string> = {
    'left-bottom': 'left-[16px] bottom-[16px]',
    'right-bottom': 'right-[16px] bottom-[16px]',
    'left-top': 'left-[16px] top-[16px]',
    'right-top': 'right-[16px] top-[16px]',
};

export const SWITCHER_MENU_POSITION: Record<TPosition, string> = {
    'left-bottom': 'left-[25px] bottom-[100px]',
    'right-bottom': 'right-[25px] bottom-[100px]',
    'left-top': 'left-[25px] top-[100px]',
    'right-top': 'right-[25px] top-[100px]',
};

export const TOOLBAR_POSITION: Record<TPosition, string> = {
    'left-bottom': 'left-[16px] bottom-[16px]',
    'right-bottom': 'right-[16px] bottom-[16px]',
    'left-top': 'left-[16px] top-[100px]',
    'right-top': 'right-[16px] top-[100px]',
};
