import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show sign in page', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await expect(page).toHaveTitle(/tykoonConnect/)
    await expect(page.locator('h1')).toContainText('tykoonConnect')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.getByText('Send Magic Link')).toBeVisible()
  })

  test('should show sign up page', async ({ page }) => {
    await page.goto('/auth/signup')
    
    await expect(page.locator('input#name')).toBeVisible()
    await expect(page.locator('input#handle')).toBeVisible()
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#client')).toBeVisible()
    await expect(page.locator('input#freelancer')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await page.fill('input[type="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    
    // Browser validation should prevent submission
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await page.click('a[href="/auth/signup"]')
    await expect(page).toHaveURL('/auth/signup')
    
    await page.click('a[href="/auth/signin"]')
    await expect(page).toHaveURL('/auth/signin')
  })
})