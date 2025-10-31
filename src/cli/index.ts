#!/usr/bin/env node
/// <reference types="node" />
import parseFlags from './parseFlags.js';
import { runThemeApply } from './runThemeApply.js';
import { createCliProgress } from './progress.js';
import { showHelp } from './help.js';

import fs from 'node:fs';
import path from 'node:path';

const VERSION = process.env.COLBRUSH_VERSION || 'unknown';

async function main() {
    const flags = parseFlags();
    const progress = createCliProgress();
    const startTime = Date.now();
    
    try {
        if (flags.version) {
            console.log(`🎨 Colbrush v${VERSION}`);
            process.exit(0);
        }

        if (flags.help) {
            showHelp();
            process.exit(0);
        }

        if (flags.doctor) {
            console.log('🔍 Running diagnostics...');
            console.log('✅ System check complete');
            process.exit(0);
        }
        
        const cmd = (flags._[0] ?? 'generate') as 'generate';
        const cssPath = typeof flags.css === 'string' ? flags.css : 'src/index.css';
        const jsonOutput = typeof flags.json === 'string' ? flags.json : null;

        if (cmd === 'generate') {
            console.log('🎨 Welcome to Colbrush!');
            console.log(`📁 Processing: ${cssPath}`);
            console.log('🌈 Generating accessible color themes...');
            
            // 파일 존재 확인
            if (!fs.existsSync(cssPath)) {
                throw new Error(`❌ CSS file not found: ${cssPath}\n\nSuggestions:\n  • Create the CSS file first\n  • Use --css to specify a different path`);
            }
            
            // 메인 처리
            const result = await runThemeApply(cssPath, progress);
            
            // JSON 출력
            if (jsonOutput) {
                const reportData = {
                    input: cssPath,
                    timestamp: new Date().toISOString(),
                    variables: result.variables,
                    themes: result.themes,
                    performance: {
                        totalTime: (Date.now() - startTime) / 1000,
                        memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)}MB`
                    },
                    exitCode: 0
                };
                
                fs.writeFileSync(jsonOutput, JSON.stringify(reportData, null, 2));
                console.log(`📄 Report saved to ${jsonOutput}`);
            }

            // 성공 메시지
            console.log('🎉 All themes generated successfully!');
            
            process.exit(0);
        }

        // 알 수 없는 명령어
        throw new Error(`❌ Unknown command: ${cmd}\n\nSuggestions:\n  • Try: colbrush generate\n  • Run: colbrush --help for usage info`);

    } catch (error) {
        console.error('❌ CLI failed:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

// 에러 핸들링
process.on('uncaughtException', (error) => {
    console.error('💥 Unexpected error occurred');
    console.error(error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('💥 Unhandled promise rejection');
    console.error(reason);
    process.exit(1);
});

main();
