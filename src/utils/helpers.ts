import { Page } from '@playwright/test';

/**
 * Dismiss any ad / consent overlays that automationexercise.com sometimes
 * injects (Google ads). These overlays cover the page and intercept clicks,
 * so removing them keeps tests stable and deterministic.
 */
export async function dismissAdsAndOverlays(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      const selectors = [
        'iframe[id^="google_ads_iframe"]',
        'ins.adsbygoogle',
        'div[id^="google_vignette"]',
        '#dismiss-button',
        '.adsbygoogle',
      ];
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
    });
  } catch {
    // Overlays are best-effort cleanup; do not fail the test.
  }
}

/**
 * Parse Automation Exercise price strings (e.g. "Rs. 500", "Rs. 2,000").
 * Uses the **first** `Rs.` amount in the text so extra lines (tax hints) do not
 * concatenate into a bogus number. Handles thousand separators with commas.
 * For dot-as-thousands patterns like `2.000` (meaning 2000), normalizes to 2000.
 */
export function parsePrice(priceText: string): number {
  const normalized = priceText.replace(/\u00a0/g, ' ').trim();
  const rupeeMatch = normalized.match(/Rs\.?\s*([\d,\s]+(?:\.\d{1,2})?)/i);
  let raw: string;

  if (rupeeMatch) {
    raw = rupeeMatch[1].replace(/[\s,]/g, '');
  } else {
    const digitsOnly = normalized.replace(/,/g, '').replace(/[^\d.]/g, '');
    return digitsOnly ? parseFloat(digitsOnly) : NaN;
  }

  // e.g. "2.000" used as two thousand → avoid parseFloat === 2
  if (/^\d+\.\d{3}$/.test(raw)) {
    raw = raw.replace('.', '');
  }

  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Wait for a page to be ready. We rely on `domcontentloaded` rather than
 * `networkidle` because the target site triggers many third-party requests
 * (analytics, ads) that never reach idle. A short bounded settle time is
 * applied to give the DOM a moment to stabilize after initial load.
 */
export async function waitForPageLoad(page: Page, timeout = 30_000): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout });
  await page.waitForTimeout(500);
}

/**
 * Scroll an element into the viewport center to ensure stable interactions
 * across browsers.
 */
export async function scrollToElement(page: Page, selector: string): Promise<void> {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    }
  }, selector);
}

/**
 * Generate a timestamp suffix used for unique test data.
 */
export function generateTimestamp(): string {
  return Date.now().toString();
}

/**
 * Generate a random integer in the inclusive range [min, max].
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sleep helper used sparingly when an explicit pause is the only option
 * (e.g. waiting for animations that don't expose a stable signal).
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
