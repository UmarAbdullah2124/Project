import { test, expect } from '@playwright/test'
import { loginAndWaitForDashboard, USERS } from './helpers'

test.describe('Projects', () => {
  test('manager can create a project and drag it between columns, and it persists after reload', async ({
    page,
  }) => {
    const uniqueTitle = `Test Project ${Date.now()}`

    await loginAndWaitForDashboard(page, USERS.manager.email, USERS.manager.password)

    await page.goto('/projects')
    await page.getByRole('button', { name: 'New Project' }).click()
    await page.locator('#title').fill(uniqueTitle)

    // Assign to whichever client happens to be first in the dropdown
    await page.locator('#clientId').click()
    await page.getByRole('option').first().click()

    await page.getByRole('button', { name: 'Create Project' }).click()

    const notStartedColumn = page.locator('[data-testid="kanban-column"][data-status="NOT_STARTED"]')
    const inProgressColumn = page.locator(
      '[data-testid="kanban-column"][data-status="IN_PROGRESS"]'
    )

    await expect(notStartedColumn.getByText(uniqueTitle)).toBeVisible()

    const card = notStartedColumn.locator('[data-testid="project-card"]', {
      hasText: uniqueTitle,
    })
    const cardBox = await card.boundingBox()
    const targetBox = await inProgressColumn.boundingBox()
    if (!cardBox || !targetBox) throw new Error('Could not measure card or column position')

    const startX = cardBox.x + cardBox.width / 2
    const startY = cardBox.y + cardBox.height / 2
    const endX = targetBox.x + targetBox.width / 2
    const endY = targetBox.y + targetBox.height / 2

    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.waitForTimeout(100)

    // dnd-kit's PointerSensor only starts a drag once the pointer has moved
    // past its activation distance. WebKit's synthetic pointer events during
    // automation need several small, spaced-out increments to reliably
    // cross that threshold and register a drag start (a single big jump,
    // which works fine in Chromium/Firefox, is not enough here).
    const steps = 20
    for (let i = 1; i <= steps; i++) {
      await page.mouse.move(
        startX + ((endX - startX) * i) / steps,
        startY + ((endY - startY) * i) / steps
      )
      await page.waitForTimeout(30)
    }

    const [response] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/graphql') &&
          res.request().postDataJSON()?.query?.includes('UpdateProjectStatus')
      ),
      (async () => {
        await page.waitForTimeout(100)
        await page.mouse.up()
      })(),
    ])
    expect(response.ok()).toBeTruthy()

    await expect(inProgressColumn.getByText(uniqueTitle)).toBeVisible()

    await page.reload()
    await page.waitForURL('**/projects')

    const inProgressColumnAfterReload = page.locator(
      '[data-testid="kanban-column"][data-status="IN_PROGRESS"]'
    )
    await expect(inProgressColumnAfterReload.getByText(uniqueTitle)).toBeVisible()
  })
})
