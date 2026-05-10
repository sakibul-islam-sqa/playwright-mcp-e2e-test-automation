import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface EnvironmentConfig {
  baseUrl: string;
  isCI: boolean;
  headless: boolean;
  slowMo: number;
  defaultTimeout: number;
  actionTimeout: number;
  navigationTimeout: number;
  defaultBrowser: string;
  logLevel: string;
  environment: string;
  testUser: {
    email: string;
    password: string;
  };
}

const getEnvVar = (name: string, defaultValue: string): string => {
  return process.env[name] ?? defaultValue;
};

const getEnvNumber = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (name: string, defaultValue: boolean): boolean => {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

export const config: EnvironmentConfig = {
  baseUrl: getEnvVar('BASE_URL', 'http://automationexercise.com'),
  isCI: getEnvBoolean('CI', false),
  headless: getEnvBoolean('HEADLESS', true),
  slowMo: getEnvNumber('SLOW_MO', 0),
  defaultTimeout: getEnvNumber('DEFAULT_TIMEOUT', 60000),
  actionTimeout: getEnvNumber('ACTION_TIMEOUT', 15000),
  navigationTimeout: getEnvNumber('NAVIGATION_TIMEOUT', 30000),
  defaultBrowser: getEnvVar('DEFAULT_BROWSER', 'chromium'),
  logLevel: getEnvVar('LOG_LEVEL', 'info'),
  environment: getEnvVar('ENV', 'local'),
  testUser: {
    email: getEnvVar('TEST_USER_EMAIL', 'test@example.com'),
    password: getEnvVar('TEST_USER_PASSWORD', 'Test@1234'),
  },
};

export default config;
