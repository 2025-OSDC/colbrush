import type {
    ResolvedOptions,
    VisionMode,
} from '../../types/simulationTypes.js';
import type { SimulationMode } from '../../devtools/vision/modes.js';

export const TOOLBAR_ID = 'cb-vision-toolbar';
export const STYLE_ID = 'cb-vision-style';
export const FILTER_ID = 'cb-vision-filter';
export const FILTER_WRAPPER_ID = 'cb-vision-filter-root';

export const DEFAULT_DEV_HOST_PATTERN =
    /(^localhost$)|(^127\.0\.0\.1$)|(^10\.)|(^172\.(1[6-9]|2\d|3[0-1])\.)|(^192\.168\.)/;

export const DEFAULT_OPTIONS: ResolvedOptions = {
    defaultMode: 'none',
    paramKey: 'vision',
    storageKey: 'colbrush:vision',
    toolbarPosition: 'left-bottom',
    hotkey: true,
    allowInProd: false,
};

export type ModeMatrix = Record<SimulationMode, string>;

export const MATRICES: ModeMatrix = {
    deuteranopia: `
    0.367  0.861 -0.228  0  0
    0.280  0.673  0.047  0  0
    -0.012  0.043  0.969  0  0
    0.000  0.000  0.000  1  0
  `,
    protanopia: `
    0.152  1.052  -0.204  0  0
    0.115  0.786  0.099  0  0
    -0.004  -0.048  1.052  0  0
    0.000  0.000  0.000  1  0
  `,
    tritanopia: `
    1.256	 -0.077  -0.179 0 0
    -0.078	0.931	 0.148 0 0
    0.005	 0.691	0.304 0 0
    0.000  0.000  0.000  1  0
  `,
};

export function desiredActiveMode(defaultMode: VisionMode): VisionMode {
    return defaultMode === 'none' ? 'deuteranopia' : defaultMode;
}

const IDENTITY_MATRIX = `
1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 1 0
`;

export function getMatrixForMode(mode: VisionMode): string {
    if (mode === 'none') return IDENTITY_MATRIX;
    return MATRICES[mode];
}
