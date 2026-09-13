import { test, expect } from '@playwright/test'
import { loginAndWaitForDashboard, USERS } from './helpers'

test.describe('Role-based access control', () => {
  test('viewer does not see Add Client / New Project / New Invoice buttons', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.viewer.email, USERS.viewer.password)

    await page.goto('/clients')
    await expect(page.getByRole('button', { name: 'Add Client' })).toHaveCount(0)

    await page.goto('/projects')
    await expect(page.getByRole('button', { name: 'New Project' })).toHaveCount(0)

    await page.goto('/invoices')
    await expect(page.getByRole('button', { name: 'New Invoice' })).toHaveCount(0)
  })

  test('admin sees Add Client / New Project / New Invoice buttons', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.admin.email, USERS.admin.password)

    await page.goto('/clients')
    await expect(page.getByRole('button', { name: 'Add Client' })).toBeVisible()

    await page.goto('/projects')
    await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible()

    await page.goto('/invoices')
    await expect(page.getByRole('button', { name: 'New Invoice' })).toBeVisible()
  })

  test('viewer does not see the Team card on Settings', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.viewer.email, USERS.viewer.password)

    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Team' })).toHaveCount(0)
  })

  test('admin sees the Team card on Settings', async ({ page }) => {
    await loginAndWaitForDashboard(page, USERS.admin.email, USERS.admin.password)

    await page.goto('/settings')
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Team' })).toBeVisible()
  })
})
