import { test, expect } from '@playwright/test'

test.describe('Simple Smoke Tests', () => {
  test('should load the page successfully', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Check that the page loads and has a title
    await expect(page).toHaveTitle(/Vite/)
  })

  test('should display the Band Shirt Bingo heading', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for the heading to be visible
    await expect(
      page.getByRole('heading', { name: 'Band Shirt Bingo' })
    ).toBeVisible()
  })

  test('should load and display band cards after delay', async ({ page }) => {
    await page.goto('http://localhost:5173')

    // Wait for at least one band to load (accounting for the 1500ms delay)
    await expect(page.getByText('Led Zeppelin')).toBeVisible({ timeout: 5000 })

    // Check that we have some band cards
    const bandCards = page.locator(
      'div[role="button"], [class*="MuiPaper-root"]'
    )
    await expect(bandCards.first()).toBeVisible()
  })
})
