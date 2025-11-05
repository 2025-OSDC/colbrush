import { expect, test } from '@playwright/test';

const toggleButtonName = /theme switcher menu|테마 전환 메뉴/;
const simulateButtonName = /simulation options|시뮬레이션 도구/;

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure a clean slate for tests while staying on the correct origin.
    await page.evaluate(() => localStorage.clear());
    await page.reload();
});

test('새로운 테마를 선택할 때 HTML의 data-theme 속성을 설정합니다.', async ({
    page,
}) => {
    await page.getByRole('button', { name: toggleButtonName }).click();
    await page.getByRole('menu', { name: 'Select theme' }).isVisible();

    await page.getByRole('menuitemradio', { name: 'protanopia' }).click();

    await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        'protanopia'
    );
    await expect(page.getByTestId('active-theme')).toHaveText('protanopia');
});

test('언어 전환 기능을 통해 언어를 한국어로 전환합니다.', async ({ page }) => {
    await page.getByRole('button', { name: toggleButtonName }).click();
    await page.getByRole('button', { name: 'English' }).click();

    await expect(page.getByTestId('active-language')).toHaveText('Korean');
    await expect(
        page.getByRole('menuitemradio', { name: '기본' })
    ).toBeVisible();
    await expect(
        page.getByRole('button', { name: toggleButtonName })
    ).toHaveAttribute('aria-label', '테마 전환 메뉴 닫기');
});

test('새로고침을 하여도 기존에 선택한 테마가 유지합니다.', async ({ page }) => {
    await page.getByRole('button', { name: toggleButtonName }).click();
    await page.getByRole('menuitemradio', { name: 'deuteranopia' }).click();

    await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        'deuteranopia'
    );

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute(
        'data-theme',
        'deuteranopia'
    );
    await expect(page.getByTestId('active-theme')).toHaveText('deuteranopia');
});

test('시뮬레이터 테마를 적용하면 루트 요소에 필터가 설정됩니다.', async ({
    page,
}) => {
    const rootFilter = () =>
        page.evaluate(
            () => document.getElementById('root')?.style.filter ?? ''
        );

    await page.getByRole('button', { name: simulateButtonName }).click();
    await page
        .getByRole('group', {
            name: /vision simulation modes|시각 시뮬레이션 모드/,
        })
        .isVisible();

    await page.getByRole('button', { name: 'protanopia' }).click();

    await expect.poll(rootFilter).toContain('cb-vision-filter');
    await expect(
        page.getByRole('button', { name: 'protanopia' })
    ).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'default' }).click();

    await expect.poll(rootFilter).toBe('');
    await expect(
        page.getByRole('button', { name: 'protanopia' })
    ).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('button', { name: 'default' })).toHaveAttribute(
        'aria-pressed',
        'true'
    );
});

test('선택한 시뮬레이터 테마는 새로고침 후에도 유지됩니다.', async ({
    page,
}) => {
    const rootFilter = () =>
        page.evaluate(
            () => document.getElementById('root')?.style.filter ?? ''
        );

    await page.getByRole('button', { name: simulateButtonName }).click();
    await page.getByRole('button', { name: 'deuteranopia' }).click();

    await expect.poll(rootFilter).toContain('cb-vision-filter');

    await page.reload();

    await expect.poll(rootFilter).toContain('cb-vision-filter');

    await page.getByRole('button', { name: simulateButtonName }).click();
    await expect(
        page.getByRole('button', { name: 'deuteranopia' })
    ).toHaveAttribute('aria-pressed', 'true');
});
