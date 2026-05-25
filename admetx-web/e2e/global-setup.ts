import { spawn } from 'child_process';
import path from 'path';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';

/**
 * Playwright global setup: starts a background worker drain loop via tsx.
 * Needed because in Next.js dev mode the instrumentation-based worker startup
 * can be unreliable. Runs startWorker() so tasks queued during the E2E test
 * get processed promptly.
 *
 * Note: the existing dev server on port 3030 already starts the worker via
 * instrumentation.ts. This setup is a safety net for fresh dev servers that
 * might not have started the worker yet.
 */
export default async function globalSetup() {
  const webRoot = path.resolve(__dirname, '..');
  const tsxBin = path.join(webRoot, 'node_modules/.bin/tsx');

  // Write a temporary TS file so tsx can resolve CJS imports correctly
  const tmpFile = path.join(tmpdir(), `admetx-worker-${Date.now()}.ts`);
  writeFileSync(
    tmpFile,
    [
      `import { startWorker } from '${webRoot}/lib/worker';`,
      `startWorker();`,
      `setInterval(() => {}, 60_000);`,
    ].join('\n'),
  );

  const proc = spawn(tsxBin, [tmpFile], {
    cwd: webRoot,
    env: { ...process.env },
    stdio: ['ignore', 'inherit', 'inherit'],
  });

  proc.on('error', (err) => {
    console.warn('[globalSetup] worker process error:', err.message);
  });

  // Give the worker time to initialise DB connection and start polling
  await new Promise<void>((resolve) => setTimeout(resolve, 1_500));

  return async () => {
    proc.kill('SIGTERM');
    try { unlinkSync(tmpFile); } catch { /* ignore */ }
  };
}
