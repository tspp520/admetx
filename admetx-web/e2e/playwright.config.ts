import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  globalSetup: './global-setup.ts',
  // Use localhost (not 127.0.0.1) so Next.js dev-mode HMR WebSocket is allowed.
  // Next.js 16 blocks HMR from 127.0.0.1 by default, preventing React hydration.
  use: { baseURL: process.env.E2E_BASE ?? 'http://localhost:3031' },
  retries: 0,
  workers: 1,
  timeout: 60_000,
});
