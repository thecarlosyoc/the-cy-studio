import { defineConfig, devices } from '@playwright/test'
import { createArgosReporterOptions } from '@argos-ci/playwright/reporter'

// Visual snapshots of the /dev-components gallery. Screenshots upload to Argos
// only when ARGOS_TOKEN is set; without it the run is a local smoke test.
export default defineConfig({
  testDir: 'tests/visual',
  forbidOnly: !!process.env.CI,
  reporter: [
    ['list'],
    ['@argos-ci/playwright/reporter', createArgosReporterOptions({ uploadToArgos: !!process.env.ARGOS_TOKEN })],
  ],
  use: { baseURL: 'http://localhost:3123', ...devices['Desktop Chrome'], reducedMotion: 'reduce' },
  webServer: {
    command: 'npm run dev -- --port 3123',
    url: 'http://localhost:3123/dev-components',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
