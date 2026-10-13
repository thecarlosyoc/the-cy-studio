import { defineConfig, devices } from '@playwright/test'
import { createArgosReporterOptions } from '@argos-ci/playwright/reporter'

// Visual snapshots of the /dev-components gallery. Screenshots upload to Argos
// only in CI, where GitHub Actions OIDC authenticates (no ARGOS_TOKEN secret);
// a local run is a smoke test.
export default defineConfig({
  testDir: 'tests/visual',
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['@argos-ci/playwright/reporter', createArgosReporterOptions({ uploadToArgos: !!process.env.CI })],
  ],
  use: { baseURL: 'http://localhost:3123', ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
  webServer: {
    command: 'npm run dev -- --port 3123',
    url: 'http://localhost:3123/dev-components',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
