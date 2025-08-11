'use client';

import React, { useEffect, useRef, useState } from 'react';
import { THEMES, ThemeType, useTheme } from './ThemeProvider.js';

type Props = {
    /** 드롭다운에 표기할 테마 목록(미지정 시 전체) */
    options?: ThemeType[];
    /** 외형 커스터마이즈용 */
    className?: string;
};

export function ThemeSwitcher({ options, className }: Props) {
    const { theme, updateTheme } = useTheme();
    const list = options?.length ? options : (THEMES as readonly ThemeType[]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <div
            ref={wrapperRef}
            className={`${className} ${
                isOpen
                    ? 'w-[130px] h-fit rounded-md'
                    : 'w-[60px] h-[60px] rounded-full'
            } fixed bottom-[10px] right-[10px] justify-center items-center flex text-[20px] bg-[#ffffff] drop-shadow-md drop-shadow-gray-400`}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            {!isOpen && '🎨'}
            {isOpen && (
                <div className="flex flex-col gap-[8px] w-full">
                    {list.map((t) => (
                        <option
                            key={t}
                            value={t}
                            className={`${
                                theme === t && 'underline'
                            } flex text-[15px] py-1 justify-center hover:bg-[#00A4A4] hover:underline text-center hover:cursor-pointer w-full`}
                            onClick={() => updateTheme(t)}
                        >
                            {t}
                        </option>
                    ))}
                </div>
            )}
        </div>
    );
}
