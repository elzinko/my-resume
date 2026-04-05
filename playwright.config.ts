import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:3457',
    extraHTTPHeaders: {
      'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
    },
  },
  webServer: {
    command: 'npm run start -- -p 3457',
    url: 'http://127.0.0.1:3457',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
