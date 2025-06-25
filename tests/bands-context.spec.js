import { test, expect } from '@playwright/test'

test.describe('Bands Context and Data Loading', () => {
  test('should show loading state initially due to simulated API delay', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // The page should load with the title but bands should not be visible immediately
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo', level: 1 })
    ).toBeVisible()

    // Initially, there should be no band cards visible (due to 1500ms simulated delay)
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(bandCards).toHaveCount(0)
  })

  test('should load bands data after simulated API delay', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for the loading to complete (1500ms simulated delay + buffer)
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Verify that bands are now loaded and displayed
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(bandCards).toHaveCount(36)
  })

  test('should provide consistent data through context', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for data to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Test that specific bands from the data are present
    const expectedBands = [
      'Led Zeppelin',
      'Queen',
      'The Beatles',
      'Metallica',
      'Pink Floyd',
      'AC/DC',
    ]

    for (const band of expectedBands) {
      await expect(page.getByText(band, { exact: true })).toBeVisible()
    }
  })

  test('should handle the full data lifecycle', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('http://localhost:5173')

    // Verify initial state (no bands visible)
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(bandCards).toHaveCount(0)

    // Wait for and verify loaded state
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    const endTime = Date.now()
    const loadTime = endTime - startTime

    // Verify the simulated delay worked (should be at least 1500ms)
    expect(loadTime).toBeGreaterThan(1400) // Allow some buffer for test execution

    // Verify all data is loaded
    await expect(bandCards).toHaveCount(36)
  })

  test('should display bands in the correct order from context data', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for data to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Get all band texts in order
    const bandTexts = await page
      .locator('[class*="MuiPaper-root"] [class*="MuiTypography-root"]')
      .allTextContents()

    // Verify the order matches the expected data structure
    const expectedOrder = [
      'Led Zeppelin',
      'Queen',
      'The Beatles',
      'The Rolling Stones',
      'AC/DC',
      'Pink Floyd',
      'Metallica',
      'Nirvana',
      "Guns N' Roses",
      'U2',
    ]

    // Check first 10 bands are in correct order
    for (let i = 0; i < expectedOrder.length; i++) {
      expect(bandTexts[i]).toBe(expectedOrder[i])
    }
  })

  test('should maintain data consistency across page interactions', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for data to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Get initial band count
    const initialBandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(initialBandCards).toHaveCount(36)

    // Interact with some cards (hover, click)
    await page.getByText('Led Zeppelin').hover()
    await page.getByText('Queen').hover()
    await page.getByText('The Beatles').click()

    // Verify data is still consistent
    await expect(initialBandCards).toHaveCount(36)
    await expect(page.getByText('Led Zeppelin')).toBeVisible()
    await expect(page.getByText('Queen')).toBeVisible()
    await expect(page.getByText('The Beatles')).toBeVisible()
  })

  test('should handle viewport changes without losing context data', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for data to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Verify initial state
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(bandCards).toHaveCount(36)

    // Change viewport size
    await page.setViewportSize({ width: 768, height: 1024 })

    // Verify data is still available
    await expect(page.getByText('Led Zeppelin')).toBeVisible()
    await expect(bandCards).toHaveCount(36)

    // Change to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify data is still available
    await expect(page.getByText('Led Zeppelin')).toBeVisible()
    await expect(bandCards).toHaveCount(36)
  })

  test('should provide data through React Query integration', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for React Query to fetch and provide data
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Verify that the data is coming from the bandsService
    // This would be reflected in the 1500ms delay and the specific band list
    const allBands = await page
      .locator('[class*="MuiPaper-root"] [class*="MuiTypography-root"]')
      .allTextContents()

    // Verify we have exactly the expected number of bands from the service
    expect(allBands).toHaveLength(36)

    // Verify specific bands that should come from the service
    expect(allBands).toContain('Led Zeppelin')
    expect(allBands).toContain('Soundgarden') // Last band in the list
    expect(allBands).toContain('The Beatles')
    expect(allBands).toContain('Metallica')
  })

  test('should handle page refresh and reload data correctly', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for initial data load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Verify initial state
    const initialBandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(initialBandCards).toHaveCount(36)

    // Refresh the page
    await page.reload()

    // Should go through loading state again
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo', level: 1 })
    ).toBeVisible()

    // Wait for data to reload
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Verify data is loaded correctly after refresh
    const reloadedBandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(reloadedBandCards).toHaveCount(36)
  })
})
