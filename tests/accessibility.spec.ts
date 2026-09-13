import { test, expect, type Page, type TestInfo } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import type { Result } from 'axe-core'
import { loginAndWaitForDashboard, USERS } from './helpers'

// axe reports 4 impact levels. "serious"/"critical" fail the build; the
// quieter "moderate"/"minor" findings are logged and attached to the report
// for visibility but don't block, since those are often subjective/low-risk.
const BLOCKING_IMPACTS = new Set(['serious', 'critical'])

function describeViolation(violation: Result) {
  const targets = violation.nodes.map((node) => `    - ${node.target.join(' ')}`).join('\n')
  return `[${violation.impact}] ${violation.id}: ${violation.help} (${violation.helpUrl})\n${targets}`
}

async function scanAndAssertNoSeriousViolations(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page }).analyze()

  const blocking = results.violations.filter((v) => BLOCKING_IMPACTS.has(v.impact ?? ''))
  const nonBlocking = results.violations.filter((v) => !BLOCKING_IMPACTS.has(v.impact ?? ''))

  if (nonBlocking.length > 0) {
    const summary = nonBlocking.map(describeViolation).join('\n\n')
    console.log(`Non-blocking (moderate/minor) axe findings on ${page.url()}:\n${summary}`)
    await testInfo.attach('axe-moderate-minor-violations', {
      body: summary,
      contentType: 'text/plain',
    })
  }

  expect(
    blocking,
    blocking.length > 0
      ? `Found ${blocking.length} serious/critical accessibility violation(s):\n\n${blocking
          .map(describeViolation)
          .join('\n\n')}`
      : undefined
  ).toEqual([])
}

test.describe('Accessibility', () => {
  test('login page (logged out) has no serious/critical violations', async ({ page }, testInfo) => {
    await page.goto('/login')
    await scanAndAssertNoSeriousViolations(page, testInfo)
  })

  test.describe('logged in as admin', () => {
    test.beforeEach(async ({ page }) => {
      await loginAndWaitForDashboard(page, USERS.admin.email, USERS.admin.password)
    })

    test('dashboard has no serious/critical violations', async ({ page }, testInfo) => {
      await page.goto('/dashboard')
      await scanAndAssertNoSeriousViolations(page, testInfo)
    })

    test('clients list has no serious/critical violations', async ({ page }, testInfo) => {
      await page.goto('/clients')
      await scanAndAssertNoSeriousViolations(page, testInfo)
    })

    test('client detail page has no serious/critical violations', async ({ page }, testInfo) => {
      // Don't assume a client already exists in the DB - create one so this
      // test is self-contained, mirroring the flow in clients.spec.ts.
      const uniqueName = `A11y Test Client ${Date.now()}`
      await page.goto('/clients')
      await page.getByRole('button', { name: 'Add Client' }).click()
      await page.locator('#name').fill(uniqueName)
      await page.getByRole('button', { name: 'Save Client' }).click()
      await expect(page.locator('table').getByText(uniqueName)).toBeVisible()

      await page.locator('table').getByText(uniqueName).click()
      await page.waitForURL(/\/clients\/.+/)
      await expect(page.getByRole('heading', { name: uniqueName })).toBeVisible()

      await scanAndAssertNoSeriousViolations(page, testInfo)
    })

    test('projects board has no serious/critical violations', async ({ page }, testInfo) => {
      await page.goto('/projects')
      await scanAndAssertNoSeriousViolations(page, testInfo)
    })

    test('invoices list has no serious/critical violations', async ({ page }, testInfo) => {
      await page.goto('/invoices')
      await scanAndAssertNoSeriousViolations(page, testInfo)
    })

    test('settings page has no serious/critical violations', async ({ page }, testInfo) => {
      await page.goto('/settings')
      await scanAndAssertNoSeriousViolations(page, testInfo)
    })
  })
})
