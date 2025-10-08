'use client';

import {
    DEFAULT_OPTIONS,
    getMatrixForMode,
} from '../core/constants/simulation.js';
import {
    MODE_LABELS,
    SIMULATION_MODES,
    isVisionMode,
} from '../core/constants/modes.js';
import { VisionMode, VisionOptions } from '../types/simulationTypes.js';
import { useEffect, useRef, useState } from 'react';
import { SimulationKey, useTheme } from './ThemeProvider.js';
import { VisionFilterPortal } from './VisionPortal.js';
import { TOOLBAR_POSITION } from '../core/constants/position.js';
import {
    FILTER_ID,
    FILTER_WRAPPER_ID,
    SimulationStorageKey,
    VISION_PORTAL_ID,
} from '../core/constants/key.js';

type FilterSnapshot = {
    filter: string;
    webkitFilter: string;
};

const originalFilterMap = new WeakMap<HTMLElement, FilterSnapshot>();

const IS_DEV: boolean = (() => {
    if (
        typeof process !== 'undefined' &&
        typeof process.env?.NODE_ENV === 'string'
    ) {
        return process.env.NODE_ENV !== 'production';
    }
    if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        return host === 'localhost' || host === '127.0.0.1';
    }
    return false;
})();

type SimulationFilterProps = VisionOptions & {
    visible?: boolean;
};

function resolveOptions(props?: SimulationFilterProps) {
    const { visible = true, ...options } = props ?? {};
    const merged = {
        ...DEFAULT_OPTIONS,
        ...options,
        storageKey: options.storageKey ?? DEFAULT_OPTIONS.storageKey,
        position: options.position ?? DEFAULT_OPTIONS.position,
        allowInProd: options.allowInProd ?? DEFAULT_OPTIONS.allowInProd,
    };
    return { config: merged, visible };
}

export default function SimulationFilter(props?: SimulationFilterProps) {
    const { config, visible } = resolveOptions(props);
    const { position, allowInProd, defaultMode, storageKey } = config;
    const [open, setOpen] = useState(false);
    const { simulationFilter, setSimulationFilter, language } = useTheme();
    const initialized = useRef(false);

    if (!visible) return null;
    if (!allowInProd && !IS_DEV) return null;

    const MODES: VisionMode[] = ['none', ...SIMULATION_MODES];
    const toolBarClass =
        TOOLBAR_POSITION[position] ?? TOOLBAR_POSITION['left-bottom'];

    const updateSimulationFilter = (value: SimulationKey) => {
        setSimulationFilter(value);
        localStorage.setItem(SimulationStorageKey, value);
    };

    useEffect(() => {
        if (typeof document === 'undefined') return;

        const resolveTarget = () => {
            const preferred =
                document.querySelector('[data-cb-vision-target]') ??
                document.getElementById('root') ??
                document.getElementById('__next');
            if (preferred instanceof HTMLElement) return preferred;

            const bodyChildren = Array.from(
                document.body?.children ?? []
            ) as HTMLElement[];
            const fallback = bodyChildren.find(
                (child) => child.id !== VISION_PORTAL_ID
            );
            return fallback ?? document.body;
        };

        const target = resolveTarget();
        if (!(target instanceof HTMLElement)) return;

        const style = target.style as CSSStyleDeclaration & {
            webkitFilter?: string;
        };

        if (!originalFilterMap.has(target)) {
            originalFilterMap.set(target, {
                filter: style.filter ?? '',
                webkitFilter: style.webkitFilter ?? '',
            });
        }

        const snapshot = originalFilterMap.get(target) ?? {
            filter: '',
            webkitFilter: '',
        };

        const applyFilter = () => {
            const filterValue = `url(#${FILTER_ID})`;
            style.filter = filterValue;
            style.webkitFilter = filterValue;
        };

        const clearFilter = () => {
            style.filter = snapshot.filter;
            style.webkitFilter = snapshot.webkitFilter;
        };

        if (simulationFilter === 'none') {
            clearFilter();
            return;
        }

        applyFilter();

        return () => {
            clearFilter();
        };
    }, [simulationFilter]);

    return (
        <VisionFilterPortal>
            <svg
                id={FILTER_WRAPPER_ID}
                aria-hidden="true"
                data-cb-vision-managed="react"
                preserveAspectRatio="none"
                style={{
                    position: 'fixed',
                    inset: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 2147483646,
                }}
            >
                <defs>
                    <filter id={FILTER_ID} data-cb-vision-managed="true">
                        <feColorMatrix
                            type="matrix"
                            values={getMatrixForMode(
                                simulationFilter as VisionMode
                            )}
                        />
                    </filter>
                </defs>
            </svg>

            <div
                className={`cb-vision-toolbar h-[36px] fixed z-[100] inline-flex items-center gap-[6px] rounded-[10px] bg-[rgba(17,17,17,0.85)] p-[6px_8px] text-[12px] text-white opacity-90 shadow-[0_6px_18px_rgba(0,0,0,0.25)] backdrop-blur-[6px] ${toolBarClass}`}
            >
                <span
                    className="font-medium hover:cursor-pointer"
                    onClick={() => setOpen(!open)}
                >
                    Vision
                </span>

                {open &&
                    MODES.map((value) => (
                        <button
                            key={value}
                            type="button"
                            className={`rounded-[6px] px-[6px] py-[3px] ${
                                simulationFilter === value
                                    ? 'bg-white text-black'
                                    : 'hover:bg-[rgba(255,255,255,0.2)]'
                            }`}
                            onClick={() => updateSimulationFilter(value)}
                        >
                            {MODE_LABELS[language][value] ?? value}
                        </button>
                    ))}
            </div>
        </VisionFilterPortal>
    );
}
