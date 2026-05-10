import { FullConfig } from '@playwright/test';
import { logger } from './src/utils/logger';
import { config } from './src/config/environment';

/**
 * Global setup runs once before the entire test suite.
 * Use this hook to validate environment configuration, warm up
 * shared services, or seed remote data.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  logger.info('========================================');
  logger.info('Playwright E2E Test Suite - Global Setup');
  logger.info('========================================');
  logger.info(`Environment: ${config.environment}`);
  logger.info(`Base URL:    ${config.baseUrl}`);
  logger.info(`Headless:    ${config.headless}`);
  logger.info(`CI mode:     ${config.isCI}`);
  logger.info('========================================');
}

export default globalSetup;
