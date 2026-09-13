import { expect, type Page } from '@playwright/test'

export const USERS = {
  admin: { email: 'admin@clientops.dev', password: 'password123' },
  manager: { email: 'manager@clientops.dev', password: 'password123' },
  viewer: { email: 'viewer@clientops.dev', password: 'password123' },
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login')

  // WebKit sometimes drops a plain .fill() on this project's custom Input
  // wrapper (Base UI), leaving the field empty even though the call resolves.
  // Typing the value key-by-key is slower but reliable across all browsers.
  const emailField = page.locator('#email')
  await emailField.click()
  await emailField.pressSequentially(email)
  await expect(emailField).toHaveValue(email)

  const passwordField = page.locator('#password')
  await passwordField.click()
  await passwordField.pressSequentially(password)
  await expect(passwordField).toHaveValue(password)

  await page.getByRole('button', { name: 'Sign In' }).click()
}

export async function loginAndWaitForDashboard(page: Page, email: string, password: string) {
  await login(page, email, password)
  await page.waitForURL('**/dashboard')
}
