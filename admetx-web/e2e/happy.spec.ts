import { test, expect } from '@playwright/test';

test('login → submit prediction → see result', async ({ page }) => {
  test.setTimeout(60_000);

  // Use localhost (not 127.0.0.1): Next.js 16 blocks HMR WebSocket from
  // 127.0.0.1 by default, which prevents React hydration in headless mode.
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  // Wait for React hydration: the form acquires __reactFiber$… keys once hydrated
  await page.waitForFunction(
    () => {
      const form = document.querySelector('form');
      return form != null && Object.getOwnPropertyNames(form).some(
        (k) => k.startsWith('__reactFiber'),
      );
    },
    { timeout: 15_000 },
  );

  await page.getByPlaceholder('用户名').fill('admin');
  await page.getByPlaceholder('密码').fill('admetx');

  // Set up response watcher BEFORE click
  const responsePromise = page.waitForResponse(
    (resp) => resp.url().includes('/api/auth/login'),
    { timeout: 10_000 },
  );
  await page.getByRole('button', { name: '登录' }).click();
  await responsePromise;

  await expect(page).toHaveURL(/\/predict$/, { timeout: 10_000 });

  // Multi-SMILES: use real newline, not backslash-n literal
  await page.getByPlaceholder(/SMILES/).fill('CCO\nc1ccccc1');

  // The project/task inputs have no placeholders; locate via label → parent div → input
  const projectLabel = page.locator('label', { hasText: '项目名称' });
  await projectLabel.locator('xpath=../input').first().fill('e2e');
  const nameLabel = page.locator('label', { hasText: '任务名称' });
  await nameLabel.locator('xpath=../input').first().fill('happy-path');

  await page.getByRole('button', { name: '提交任务' }).click();

  await expect(page).toHaveURL(/\/tasks\/[0-9a-f-]+$/, { timeout: 10_000 });
  await expect(page.getByText(/succeeded|partial_failed|failed/)).toBeVisible({ timeout: 30_000 });
  // Two SMILES → two result rows, both containing MW; .first() avoids strict mode
  await expect(page.getByText(/MW/).first()).toBeVisible({ timeout: 10_000 });
});
