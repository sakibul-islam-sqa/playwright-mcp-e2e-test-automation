import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = process.env.BASE_URL ?? 'http://automationexercise.com';
const CI = !!process.env.CI;
/** Set in CI when sharding; shards upload blob reports and merge-reports builds HTML for GitHub Pages. */
const BLOB_REPORT = !!process.env.PLAYWRIGHT_BLOB_REPORT;

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  outputDir: './test-results',

  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },

  fullyParallel: true,

  forbidOnly: CI,

  retries: CI ? 2 : 1,

  workers: CI ? 2 : 1,

  reporter: [
    ...(BLOB_REPORT
      ? [['blob'] as const]
      : [
          [
            'html',
            { open: CI ? 'never' : 'on-failure', outputFolder: 'playwright-report' },
          ] as const,
        ]),
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ...(CI ? [['github'] as ['github']] : []),
  ],

  use: {
    baseURL: BASE_URL,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    actionTimeout: 15 * 1000,

    navigationTimeout: 30 * 1000,

    viewport: { width: 1440, height: 900 },

    ignoreHTTPSErrors: true,

    locale: 'en-US',

    timezoneId: 'UTC',

    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },

    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
    },
  },

  /**
   * Chromium / Desktop Chrome is the default (`npm test` passes `--project=chromium`).
   * Other projects are optional: `npm run test:all` or `--project=firefox`, etc.
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 7'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 14'] },
    // },
  ],
});
