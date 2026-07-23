import { expect, test } from '@playwright/test';

test('首页展示 11 个 WorkBuddy 单元且移动端无横向滚动', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'WorkBuddy 保姆级入门教程',
  );
  await expect(page.locator('[data-lesson-card]')).toHaveCount(11);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test('第一次任务必须按顺序经过计划确认后才出现产物', async ({ page }) => {
  await page.goto('/chapter/first-task');
  const nextButton = page.locator('[data-next-step]');
  const artifact = page.locator('[data-artifact]');

  await expect(artifact).toBeHidden();
  await nextButton.click();
  await nextButton.click();
  await nextButton.click();
  await expect(page.locator('[data-plan]')).toBeVisible();
  await expect(nextButton).toHaveText('确认计划');
  await nextButton.click();
  await nextButton.click();
  await expect(artifact).toBeVisible();
  await nextButton.click();
  await expect(page.locator('[data-task-status]')).toContainText('第一单完成');
});

test('提示词五项填满后得到 100 分并生成指令', async ({ page }) => {
  await page.goto('/chapter/prompt-builder');
  const lab = page.locator('[data-prompt-builder]');

  await expect(lab.locator('[data-score]')).toHaveText('20 / 100');
  await lab.locator('[name="input"]').fill('meeting-notes.txt');
  await lab.locator('[name="steps"]').fill('只使用原始记录');
  await lab.locator('[name="output"]').fill('meeting-summary.md');
  await lab.locator('[name="acceptance"]').fill('包含负责人和截止时间');
  await expect(lab.locator('[data-score]')).toHaveText('100 / 100');

  await lab.locator('[data-generate]').click();
  await expect(lab.locator('[data-output]')).toContainText(
    '输出格式：meeting-summary.md',
  );
});

test('工作模式和权限会根据任务风险分别推荐', async ({ page }) => {
  await page.goto('/chapter/modes-and-permissions');
  const lab = page.locator('[data-mode-permission-lab]');

  await lab.locator('[data-scenario]').selectOption('multi');
  await expect(lab.locator('[data-work-mode]')).toHaveText('Plan');
  await expect(lab.locator('[data-permission-mode]')).toHaveText('默认权限');

  await lab.locator('[data-scenario]').selectOption('risky');
  await expect(lab.locator('[data-recommendation]')).toContainText('风险较高');
});

test('标记完成后首页显示本地学习进度', async ({ page }) => {
  await page.goto('/chapter/what-is-workbuddy');
  await page.locator('[data-complete-button]').click();
  await page.goto('/');

  await expect(page.locator('[data-completed-count]')).toHaveText('1');
  await expect(
    page.locator('[data-lesson-card][data-slug="what-is-workbuddy"] [data-completion-mark]'),
  ).toHaveText('已完成');
});

test('第一次任务可只用键盘完成', async ({ page }) => {
  await page.goto('/chapter/first-task');
  const nextButton = page.locator('[data-next-step]');

  await nextButton.focus();
  for (let step = 0; step < 6; step += 1) {
    await page.keyboard.press('Enter');
  }

  await expect(page.locator('[data-task-status]')).toContainText('第一单完成');
});

test('深色与减少动态效果模式下全部站内课程链接可访问且无控制台错误', async ({
  page,
  request,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.goto('/');

  const mediaPreferences = await page.evaluate(() => ({
    dark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  }));
  expect(mediaPreferences).toEqual({ dark: true, reducedMotion: true });

  const chapterUrls = await page.locator('a[href^="/chapter/"]').evaluateAll((links) =>
    [...new Set(links.map((link) => (link as HTMLAnchorElement).href))],
  );
  expect(chapterUrls).toHaveLength(11);

  for (const url of chapterUrls) {
    const response = await request.get(url);
    expect(response.ok(), `${url} 应当可访问`).toBe(true);
    await page.goto(url);
  }

  expect(consoleErrors).toEqual([]);
});
