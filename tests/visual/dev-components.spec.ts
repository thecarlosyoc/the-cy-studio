import { test } from '@playwright/test'
import { argosScreenshot } from '@argos-ci/playwright'

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  // Nav/Dock only renders below md (768px).
  { name: 'mobile', width: 390, height: 844 },
]

for (const vp of viewports) {
  test(`dev-components gallery (${vp.name})`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    // Video frames never match between runs: block the files so the poster stays.
    await page.route(/\.(mp4|webm)(\?|$)/, route => route.abort())
    await page.goto('/dev-components')
    await argosScreenshot(page, `dev-components-${vp.name}`, {
      fullPage: true,
      // The gallery renders Loading states on purpose, so aria-busy never clears.
      stabilize: { waitForAriaBusy: false },
    })
  })
}
