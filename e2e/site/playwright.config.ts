import { defineConfig, devices } from '@playwright/test';

const useExternalServer =
    process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1' ||
    process.env.PLAYWRIGHT_SKIP_WEB_SERVER === '1';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
    use: {
        baseURL: 'http://127.0.0.1:4173',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: useExternalServer
        ? undefined
        : {
              command: 'pnpm dev -- --host 127.0.0.1 --port 4173',
              url: 'http://127.0.0.1:4173',
              reuseExistingServer: !process.env.CI,
              stdout: 'pipe',
              stderr: 'pipe',
          },
});
