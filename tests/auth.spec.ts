import { test, expect } from '@playwright/test'
import { login, loginAndWaitForDashboard, USERS } from './helpers'

test.describe('Authentication', () => {
  test('visiting /dashboard while logged out redirects to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('logging in with wrong password shows an inline error and stays on /login', async ({
    page,
  }) => {
    await login(page, USERS.admin.email, 'wrong-password')
    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page).toHaveURL(/\/login/)
  })

  test('logging in as admin succeeds and lands on /dashboard', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.admin.email, USERS.admin.password)
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('signing out and revisiting /dashboard redirects to /login again', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.admin.email, USERS.admin.password)

    await page.locator('button[title="Sign out"]').click()
    await page.waitForURL('**/login')

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})
