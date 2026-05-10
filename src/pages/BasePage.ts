import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import { dismissAdsAndOverlays, waitForPageLoad } from '../utils/helpers';

/**
 * Foundation for all page objects.
 * Provides shared navigation, assertion, and interaction helpers so that
 * concrete pages can stay focused on their unique behaviour.
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly pageName: string;

  constructor(page: Page, pageName = 'BasePage') {
    this.page = page;
    this.pageName = pageName;
  }

  async navigate(path = ''): Promise<void> {
    logger.step(`Navigating to "${path || '/'}"`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await waitForPageLoad(this.page);
    await dismissAdsAndOverlays(this.page);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async reload(): Promise<void> {
    logger.step('Reloading page');
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await waitForPageLoad(this.page);
  }

  async waitForVisible(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 15_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click that survives flaky third-party overlays (ads/consent banners)
   * by attempting a clean click first, dismissing overlays, then falling
   * back to a forced click when an overlay is intercepting events.
   *
   * The forced fallback is intentional here, hence the inline disable.
   */
  async safeClick(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    try {
      await locator.click({ timeout: 5_000 });
    } catch {
      await dismissAdsAndOverlays(this.page);
      // eslint-disable-next-line playwright/no-force-option
      await locator.click({ force: true });
    }
  }

  async hoverElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.hover();
  }

  async fillField(locator: Locator, value: string): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    const text = await locator.textContent();
    return (text ?? '').trim();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `test-results/screenshots/${this.pageName}-${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }

  async assertUrlContains(expected: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  async assertElementVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  async assertElementHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  async assertElementText(
    locator: Locator,
    expectedText: string | RegExp,
    message?: string,
  ): Promise<void> {
    if (expectedText instanceof RegExp) {
      await expect(locator, message).toHaveText(expectedText);
    } else {
      await expect(locator, message).toContainText(expectedText);
    }
  }

  async assertElementCount(locator: Locator, count: number, message?: string): Promise<void> {
    await expect(locator, message).toHaveCount(count);
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async dismissOverlays(): Promise<void> {
    await dismissAdsAndOverlays(this.page);
  }
}
