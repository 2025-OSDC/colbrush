import { variableRegex } from '../core/constants/regex.js';
import type { VariableInput } from '../core/types.js';
import { applyThemes } from './applyThemes.js';
import { prepareCandidates, buildThemeForVision } from './colorTransform.js';
import { removeExistingThemeBlocks } from './removeExistingThemeBlocks.js';
import { isNeutralColor, calculateScale } from './utils/colorUtils.js';
import { createCLIError } from './utils/errors.js';
import { VISIONS, VISION_LABELS } from './constants.js';
import type { ProgressReporter } from './progress.js';
import fs from 'node:fs';

export interface RunThemeApplyResult {
    variables: {
        found: number;
        processed: number;
        skipped: number;
    };
    themes: Array<{
        type: string;
        status: 'success' | 'fallback' | 'error';
        variables: number;
        executionTime: number;
    }>;
}

export async function runThemeApply(
    cssPath: string,
    progress?: ProgressReporter
): Promise<RunThemeApplyResult> {
    const quiet = !progress; // progress가 없으면 quiet mode
    const result: RunThemeApplyResult = {
        variables: { found: 0, processed: 0, skipped: 0 },
        themes: []
    };

    try {
        let content = fs.readFileSync(cssPath, 'utf8');

        if (!quiet) {
            progress?.startSection('🧹 Preparing workspace');
            progress?.update(50, 'Removing existing themes...');
        }

        content = removeExistingThemeBlocks(content);

        if (!quiet) {
            progress?.update(100, 'Workspace cleaned');
            progress?.finishSection();
        }

        const variables: VariableInput = {};

        // CSS 변수 추출
        if (!quiet) {
            progress?.startSection('🔍 Analyzing CSS variables');
        }

        const scanRegex = new RegExp(variableRegex.source, variableRegex.flags);
        const all = Array.from(content.matchAll(scanRegex));
        result.variables.found = all.length;

        if (all.length === 0) {
            throw createCLIError(
                'No CSS custom properties found',
                4,
                [
                    'Add CSS variables to your file using @theme { }',
                    'Example: --color-primary-500: #7fe4c1;',
                    'Make sure variables start with --color-'
                ]
            );
        }

        const loopRegex = new RegExp(variableRegex.source, variableRegex.flags);
        let match;
        let count = 0;

        while ((match = loopRegex.exec(content)) !== null) {
            const [, key, value] = match;
            const cleanKey = key.trim();
            const cleanValue = value.trim().toLowerCase();

            count++;
            const percent = (count / all.length) * 100;

            if (isNeutralColor(cleanValue)) {
                result.variables.skipped++;
                continue;
            }

            const scale = calculateScale(cleanKey, cleanValue);
            variables[cleanKey] = { base: cleanValue, scale };
            result.variables.processed++;

            if (!quiet && progress) {
                progress.update(percent, `Found: ${cleanKey}`);
            }
        }

        if (!quiet) {
            progress?.finishSection(`Found ${result.variables.processed} color variables`);
        }

        if (result.variables.processed === 0) {
            throw createCLIError(
                'No processable color variables found',
                4,
                [
                    'Ensure you have non-neutral colors in HEX format',
                    'Example: --color-primary: #7fe4c1; (not #ffffff or #000000)',
                    'Variables should start with --color-'
                ]
            );
        }

        // 테마 생성
        // 색상 변환 처리
        try {
            const { colorKeys, baseColorsArray } = prepareCandidates(variables, progress);

            for (const vision of VISIONS) {
                const visionStartTime = Date.now();
                const label = VISION_LABELS[vision];

                if (!quiet) {
                    progress?.startSection(label);
                }

                try {
                    if (!quiet && progress) {
                        progress.update(50, 'Processing...');
                    }

                    const themeData = buildThemeForVision(colorKeys, baseColorsArray, vision);
                    await applyThemes(themeData, cssPath, { silent: !!progress });

                    const executionTime = (Date.now() - visionStartTime) / 1000;

                    if (!quiet) {
                        progress?.update(100, 'Theme generated successfully');
                        progress?.finishSection('✅ Complete');
                    }

                    result.themes.push({
                        type: vision,
                        status: 'success',
                        variables: result.variables.processed,
                        executionTime
                    });

                } catch (visionError) {
                    if (!quiet && progress) {
                        progress.update(75, 'Failed optimized generation, using fallback...');
                    }

                    await applyThemes({ vision, variables }, cssPath, { silent: !!progress });

                    const executionTime = (Date.now() - visionStartTime) / 1000;

                    if (!quiet) {
                        progress?.finishSection('⚠️ Fallback applied');
                    }

                    result.themes.push({
                        type: vision,
                        status: 'fallback',
                        variables: result.variables.processed,
                        executionTime
                    });
                }
            }

        } catch (error) {
            if (!quiet && progress) {
                progress.update(50, '🔄 Using fallback color mapping for all themes...');
            }

            for (const vision of VISIONS) {
                const visionStartTime = Date.now();
                const label = `${VISION_LABELS[vision]} (Fallback)`;

                if (!quiet) {
                    progress?.startSection(label);
                }

                await applyThemes({ vision, variables }, cssPath, { silent: !!progress });

                const executionTime = (Date.now() - visionStartTime) / 1000;

                if (!quiet) {
                    progress?.finishSection('⚠️ Fallback applied');
                }

                result.themes.push({
                    type: vision,
                    status: 'fallback',
                    variables: result.variables.processed,
                    executionTime
                });
            }
        }

        // 최종 요약
        if (!quiet) {
            const successCount = result.themes.filter(t => t.status === 'success').length;
            const fallbackCount = result.themes.filter(t => t.status === 'fallback').length;

            console.log('\n📊 Generation Results:');
            result.themes.forEach(theme => {
                const label = VISION_LABELS[theme.type as keyof typeof VISION_LABELS];
                const status = theme.status === 'success' ? '✅ Success' :
                             theme.status === 'fallback' ? '⚠️ Fallback' : '❌ Error';
                console.log(`  ${label}: ${status} (${theme.variables} colors, ${theme.executionTime.toFixed(1)}s)`);
            });

            console.log('\n📋 Summary:');
            console.log(`  Input file: ${cssPath}`);
            console.log(`  Variables found: ${result.variables.found}`);
            console.log(`  Variables processed: ${result.variables.processed}`);
            console.log(`  Variables skipped: ${result.variables.skipped}`);
            console.log(`  Themes generated: ${result.themes.length}`);
            console.log(`  Success rate: ${successCount}/${result.themes.length}`);
            if (fallbackCount > 0) {
                console.log(`  Fallback used: ${fallbackCount}`);
            }

            // 결과에 따른 메시지
            if (successCount === result.themes.length) {
                console.log('\n🎉 All themes generated with optimized colors!');
            } else if (successCount > 0) {
                console.log(`\n⚠️ ${fallbackCount} themes used fallback mapping`);
                console.log('💡 This may result in less optimal color accessibility');
            } else {
                console.log('\n⚠️ All themes used fallback mapping');
                console.log('💡 Consider adjusting your base color palette for better results');
            }
        }

        return result;

    } catch (error) {
        if (error instanceof Error && (error as any).code) {
            throw error; // Re-throw CLI errors as-is
        }

        if (error instanceof Error) {
            // 파일 없음 에러
            if (error.message.includes('ENOENT')) {
                throw createCLIError(
                    `File not found: ${cssPath}`,
                    2,
                    ['Check if the file path is correct', 'Use --css to specify the correct path']
                );
            }

            // 권한 에러
            if (error.message.includes('EACCES')) {
                throw createCLIError(
                    `Permission denied: ${cssPath}`,
                    6,
                    ['Check file permissions', 'Run with appropriate privileges']
                );
            }

            // CSS 파싱 에러
            if (error.message.includes('parse') || error.message.includes('syntax')) {
                throw createCLIError(
                    `CSS parsing failed: ${error.message}`,
                    3,
                    ['Check CSS syntax in your file']
                );
            }
        }

        // 일반적인 에러
        throw createCLIError(
            `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
            1,
            ['Please double-check your CSS file for any syntax errors.', ' Try running `colbrush --doctor` to diagnose your system.', 'Update the package to the latest version and try again.']
        );
    }
}
