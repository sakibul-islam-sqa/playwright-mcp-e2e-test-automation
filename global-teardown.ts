import { FullConfig } from '@playwright/test';
import { logger } from './src/utils/logger';

/**
 * Global teardown runs once after the entire test suite completes.
 * Use this hook to clean up shared state or publish summary information.
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  logger.info('========================================');
  logger.info('Playwright E2E Test Suite - Teardown');
  logger.info(`Completed at: ${new Date().toISOString()}`);
  logger.info('========================================');
}

export default globalTeardown;
