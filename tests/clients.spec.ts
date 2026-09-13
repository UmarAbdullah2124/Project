import { test, expect } from '@playwright/test'
import { loginAndWaitForDashboard, USERS } from './helpers'

test.describe('Clients', () => {
  test('manager can create a client, search for it, and open its detail page', async ({
    page,
  }) => {
    const uniqueName = `Test Client ${Date.now()}`

    await loginAndWaitForDashboard(page, USERS.manager.email, USERS.manager.password)

    await page.goto('/clients')
    await page.getByRole('button', { name: 'Add Client' }).click()
    await page.locator('#name').fill(uniqueName)
    await page.getByRole('button', { name: 'Save Client' }).click()

    const table = page.locator('table')
    await expect(table.getByText(uniqueName)).toBeVisible()

    // Search filters the table down to just this client
    await page.locator('input[placeholder="Search clients..."]').fill(uniqueName)
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(table.getByText(uniqueName)).toBeVisible()

    // Clicking the row navigates to the detail page
    await table.getByText(uniqueName).click()
    await page.waitForURL(/\/clients\/.+/)
    await expect(page.getByRole('heading', { name: uniqueName })).toBeVisible()
  })
})
