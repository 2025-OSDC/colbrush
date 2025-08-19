'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    useTheme,
    getThemeOptions,
    THEME_LABEL,
    type ThemeKey,
} from './ThemeProvider.js';
import Logo from '../icons/Logo.js';
import US from '../icons/Us.js';
import KR from '../icons/Kr.js';
import XButton from '../icons/X.js';
import IconTritanopia from '../icons/theme/Tritanopia.js';
import IconDefault from '../icons/theme/Default.js';
import IconProtanopia from '../icons/theme/Protanopia.js';
import IconDeuteranopia from '../icons/theme/Deuteranopia.js';
import { ThemeSwitcherPortal } from './ThemeSwitcherPortal.js';

const THEME_ICON: Record<ThemeKey, React.FC<React.SVGProps<SVGSVGElement>>> = {
    default: IconDefault,
    protanopia: IconProtanopia,
    deuteranopia: IconDeuteranopia,
    tritanopia: IconTritanopia,
};
type Props = {
    options?: { key: ThemeKey; label: string }[]; // ← 라벨/키 쌍으로 받기
    className?: string;
};

export function ThemeSwitcher({ options, className }: Props) {
    const { theme, updateTheme, language, updateLanguage } = useTheme();
    const [hovered, setHovered] = useState<string | null>(null);
    const list = useMemo(
        () => (options?.length ? options : getThemeOptions(language)),
        [options, language]
    );
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // 바깥 클릭 닫기
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    return (
        <ThemeSwitcherPortal>
            <div
                ref={wrapperRef}
                className="flex w-[100vw] h-[100vh] z-[10000]"
            >
                {/* 토글 버튼 */}
                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={toggle}
                    className="fixed right-[25px] bottom-[25px] w-[60px] h-[60px] p-[10px] bg-[#ffffff] rounded-full flex justify-center items-center shadow-[0_0_3px_0_rgba(0,0,0,0.17)]"
                >
                    {isOpen ? (
                        <XButton className="self-center" />
                    ) : (
                        <Logo className="self-center" />
                    )}
                </button>

                {/* 메뉴 목록 */}
                {isOpen && (
                    <div
                        role="menu"
                        aria-label="Select theme"
                        className="fixed bottom-[100px] right-[25px] flex-col bg-[#ffffff] rounded-[18px] w-[220px] gap-[11px]"
                    >
                        <div>
                            {list.map((opt) => {
                                const Icon = THEME_ICON[opt.key];
                                return (
                                    <div key={opt.key}>
                                        <button
                                            key={opt.key}
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={theme === opt.key}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateTheme(opt.key);
                                            }}
                                            onMouseEnter={() =>
                                                setHovered(opt.key)
                                            }
                                            onMouseLeave={() =>
                                                setHovered(null)
                                            }
                                            className={[
                                                'hover:cursor-pointer group text-[18px] text-[#3D4852] py-1 w-full h-[50px] text-center gap-[8px] flex items-center justify-center rounded-[18px] hover:bg-[#3D4852]',
                                                theme === opt.key
                                                    ? 'bg-[#3D4852] text-[#ffffff]'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            <Icon
                                                width={24}
                                                height={24}
                                                className={`inline-block ${
                                                    theme === opt.key ||
                                                    hovered === opt.key
                                                        ? 'text-white'
                                                        : 'text-[#3D4852]'
                                                }`}
                                            />
                                            <span className="group-hover:text-[#ffffff]">
                                                {opt.label}
                                            </span>
                                        </button>
                                        {opt.key !== 'tritanopia' && (
                                            <div className="border-b-[0.5px] border-b-[#D9D9D9] w-full"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="w-full border-[0.5px] border-[#B8B8B8]" />

                        <div className="flex justify-evenly items-center gap-[10px] px-[10px] my-[15px]">
                            {language === 'English' ? (
                                <div
                                    className={`hover:cursor-pointer flex text-[18px] text-[#3D4852] gap-[8px] items-center justify-center`}
                                    onClick={() => updateLanguage('Korean')}
                                >
                                    <US />
                                    English
                                </div>
                            ) : (
                                <div
                                    className={`hover:cursor-pointer flex text-[18px] text-[#3D4852] gap-[8px] items-center justify-center `}
                                    onClick={() => updateLanguage('English')}
                                >
                                    <KR />
                                    Korean
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ThemeSwitcherPortal>
    );
}
