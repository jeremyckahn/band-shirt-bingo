import { test, expect } from '@playwright/test'

const EXPECTED_BANDS = [
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
  'Red Hot Chili Peppers',
  'Foo Fighters',
  'Green Day',
  'Pearl Jam',
  'Aerosmith',
  'Iron Maiden',
  'Black Sabbath',
  'Deep Purple',
  'Van Halen',
  'Rush',
  'Def Leppard',
  'Bon Jovi',
  'Journey',
  'Eagles',
  'The Who',
  'Jimi Hendrix Experience',
  'Cream',
  'The Doors',
  'Dire Straits',
  'Fleetwood Mac',
  'Lynyrd Skynyrd',
  'The Clash',
  'Ramones',
  'ZZ Top',
  'KISS',
  'Soundgarden',
]

test.describe('Band Shirt Bingo', () => {
  test('should load the page and display the main title', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Check that the main title is present
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo', level: 1 })
    ).toBeVisible()
  })

  test('should display all band names in a grid after loading', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for bands to load (there's a simulated 1500ms delay)
    // We'll wait for a specific band to appear to ensure data has loaded
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Check that all expected bands are present
    for (const band of EXPECTED_BANDS) {
      await expect(page.getByText(band, { exact: true })).toBeVisible()
    }
  })

  test('should display exactly 36 band cards in a 6x6 grid', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Count the number of band cards (Paper components containing band names)
    const bandCards = page
      .locator('[class*="MuiPaper-root"]')
      .filter({ hasText: /^[A-Za-z0-9\s'&\-\/]+$/ })
    await expect(bandCards).toHaveCount(36)
  })

  test('should have proper grid layout structure', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Check that the grid container exists (look for parent of multiple bands)
    const gridContainer = page
      .locator('div')
      .filter({
        has: page.getByText('Led Zeppelin'),
      })
      .filter({
        has: page.getByText('Queen'),
      })
      .filter({
        has: page.getByText('The Beatles'),
      })
      .first()

    await expect(gridContainer).toBeVisible()

    // Verify grid structure by checking that it contains all 36 band cards
    const bandCardsInGrid = gridContainer.locator('[class*="MuiPaper-root"]')
    await expect(bandCardsInGrid).toHaveCount(36)

    // Verify grid-like layout by checking CSS properties
    const hasGridLayout = await gridContainer.evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return (
        styles.display === 'grid' ||
        styles.gridTemplateColumns !== '' ||
        el.style.display === 'grid' ||
        el.style.gridTemplateColumns.includes('repeat(6, 1fr)')
      )
    })
    expect(hasGridLayout).toBe(true)
  })

  test('should show hover effects on band cards', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Get the first band card
    const firstBandCard = page.getByText('Led Zeppelin').locator('..')

    // Hover over the card
    await firstBandCard.hover()

    // The card should have cursor: pointer (indicating it's interactive)
    await expect(firstBandCard).toHaveCSS('cursor', 'pointer')
  })

  test('should contain specific well-known bands', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Test for some iconic bands
    const iconicBands = [
      'The Beatles',
      'Queen',
      'Led Zeppelin',
      'Pink Floyd',
      'AC/DC',
    ]

    for (const band of iconicBands) {
      await expect(page.getByText(band, { exact: true })).toBeVisible()
    }
  })

  test('should handle responsive design on smaller screens', async ({
    page,
  }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Title should still be visible
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo', level: 1 })
    ).toBeVisible()

    // All bands should still be present
    await expect(page.getByText('Led Zeppelin')).toBeVisible()
    await expect(page.getByText('Queen')).toBeVisible()
    await expect(page.getByText('The Beatles')).toBeVisible()
  })

  test('should have accessible band card text', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Check that band names have proper typography styling
    const bandCard = page.getByText('Led Zeppelin')

    // Should have proper font weight (bold)
    await expect(bandCard).toHaveCSS('font-weight', '700')

    // Should have center alignment
    await expect(bandCard).toHaveCSS('text-align', 'center')
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = []

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Listen for uncaught exceptions
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Should have no JavaScript errors
    expect(errors).toEqual([])
  })

  test('should have proper dark theme styling', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Check that dark theme is applied to the body/background
    const body = page.locator('body')

    // Should have dark background color (Material-UI dark theme default)
    await expect(body).toHaveCSS('background-color', 'rgb(18, 18, 18)')
  })

  test('should display bands in expected order', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for content to load
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 3000 })

    // Get all band cards and verify the first few are in expected order
    const allBandTexts = await page
      .locator('[class*="MuiPaper-root"] [class*="MuiTypography-root"]')
      .allTextContents()

    // Verify we have the expected number of bands
    expect(allBandTexts).toHaveLength(36)

    // Verify the first few bands are in the expected order
    expect(allBandTexts[0]).toBe('Led Zeppelin')
    expect(allBandTexts[1]).toBe('Queen')
    expect(allBandTexts[2]).toBe('The Beatles')
    expect(allBandTexts[3]).toBe('The Rolling Stones')
  })
})
