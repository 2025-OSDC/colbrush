'use client';

import React, { useEffect, useRef, useState } from 'react';
import { THEMES, ThemeType, useTheme } from './ThemeProvider.js';

type Props = {
    options?: ThemeType[];
    className?: string;
};

export function ThemeSwitcher({ options, className }: Props) {
    const { theme, updateTheme } = useTheme();
    const list = options?.length ? options : (THEMES as readonly ThemeType[]);
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
        <div
            ref={wrapperRef}
            className={[
                'fixed bottom-[10px] right-[10px] flex justify-center items-center text-[20px] bg-white drop-shadow-md',
                isOpen
                    ? 'w-[150px] h-fit rounded-md p-2'
                    : 'w-[60px] h-[60px] rounded-full',
                className ?? '',
            ].join(' ')}
            role="presentation"
        >
            {/* 토글 버튼 */}
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={toggle}
                className={['w-full', isOpen ? 'hidden' : 'block'].join(' ')}
            >
                🎨
            </button>

            {/* 메뉴 목록 */}
            {isOpen && (
                <div
                    role="menu"
                    aria-label="Select theme"
                    className="flex flex-col gap-1 w-full"
                >
                    {list.map((t) => (
                        <button
                            key={t}
                            type="button"
                            role="menuitemradio"
                            aria-checked={theme === t}
                            onClick={(e) => {
                                e.stopPropagation();
                                updateTheme(t);
                                setIsOpen(false);
                            }}
                            className={[
                                'text-[14px] py-1 w-full text-center rounded',
                                'hover:underline hover:bg-[#00A4A4]',
                                theme === t ? 'underline' : '',
                            ].join(' ')}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
