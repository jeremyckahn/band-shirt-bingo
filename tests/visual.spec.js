import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('should match the full page screenshot after bands load', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load completely
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Take a full page screenshot
    await expect(page).toHaveScreenshot('full-page-loaded.png')
  })

  test('should match the bingo grid layout screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Take screenshot of just the grid container
    const gridContainer = page.locator(
      '[style*="grid-template-columns: repeat(6, 1fr)"]'
    )
    await expect(gridContainer).toHaveScreenshot('bingo-grid-layout.png')
  })

  test('should match loading state screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Take screenshot immediately after navigation (before bands load)
    // This captures the loading state with just the title
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo', level: 1 })
    ).toBeVisible()

    // Ensure we're still in loading state (no bands visible yet)
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z\s'&-]+$/ })
    await expect(bandCards).toHaveCount(0)

    await expect(page).toHaveScreenshot('loading-state.png')
  })

  test('should match hover state screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Hover over a specific band card
    const ledZeppelinCard = page.getByText('Led Zeppelin').locator('..')
    await ledZeppelinCard.hover()

    // Take screenshot of the hovered card
    await expect(ledZeppelinCard).toHaveScreenshot('band-card-hover.png')
  })

  test('should match mobile viewport screenshot', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Take full page screenshot on mobile
    await expect(page).toHaveScreenshot('mobile-full-page.png')
  })

  test('should match tablet viewport screenshot', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Take full page screenshot on tablet
    await expect(page).toHaveScreenshot('tablet-full-page.png')
  })

  test('should match individual band card screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Take screenshot of a single band card
    const singleCard = page.getByText('Queen').locator('..')
    await expect(singleCard).toHaveScreenshot('single-band-card.png')
  })

  test('should match dark theme styling screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Focus on the overall dark theme appearance
    const container = page.locator('body')
    await expect(container).toHaveScreenshot('dark-theme-styling.png')
  })

  test('should match grid with all band names visible', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Ensure all 36 bands are loaded
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z\s'&-]+$/ })
    await expect(bandCards).toHaveCount(36)

    // Take screenshot focusing on text readability
    const gridContainer = page.locator(
      '[style*="grid-template-columns: repeat(6, 1fr)"]'
    )
    await expect(gridContainer).toHaveScreenshot('all-bands-visible.png')
  })

  test('should match title and header area screenshot', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Take screenshot of just the header area
    const titleArea = page.getByRole('heading', {
      name: 'Band Shirt Bingo',
      level: 1,
    })
    await expect(titleArea).toHaveScreenshot('title-header.png')
  })

  test('should match responsive grid at different screen sizes', async ({
    page,
  }) => {
    const viewports = [
      { width: 320, height: 568, name: 'small-mobile' },
      { width: 414, height: 896, name: 'large-mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop' },
      { width: 1440, height: 900, name: 'large-desktop' },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      })
      await page.goto('http://localhost:5173')

      // Wait for bands to load
      await expect(page.getByText('Led Zeppelin')).toBeVisible({
        timeout: 3000,
      })

      // Take screenshot of the grid at this viewport size
      const gridContainer = page.locator(
        '[style*="grid-template-columns: repeat(6, 1fr)"]'
      )
      await expect(gridContainer).toHaveScreenshot(`grid-${viewport.name}.png`)
    }
  })
})
