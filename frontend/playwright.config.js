import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,   // tests share the same backend DB — run serially
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      // E2E backend on port 5001 using isolated test database
      command: 'node src/server.e2e.js',
      cwd: path.resolve(__dirname, '../backend'),
      port: 5001,
      timeout: 30_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      // Vite dev server — proxies API calls to port 5001 via VITE_API_BASE_URL
      command: 'npm run dev',
      port: 5173,
      timeout: 30_000,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_BASE_URL: 'http://localhost:5001/api',
      },
    },
  ],
});
