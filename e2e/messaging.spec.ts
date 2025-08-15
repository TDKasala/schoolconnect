import { test, expect } from '@playwright/test';

// Placeholder E2E outline for messaging; currently skipped
// Fill in selectors and flows once login fixtures and data seeds are available

test.describe.skip('Messaging', () => {
  test('shows peers and thread updates', async ({ page }) => {
    // Given user is logged in (todo: use auth helper)
    // await loginAs(page, 'teacher@example.com', 'password');

    await page.goto('/');
    await page.getByRole('link', { name: /messagerie/i }).click();

    // Conversations list appears
    await expect(page.getByText(/Messagerie/i)).toBeVisible();

    // Click first peer
    // const first = page.locator('[data-test=peer-item]').first();
    // await first.click();

    // Send message
    // await page.getByPlaceholder('Écrire un message').fill('Hello');
    // await page.getByRole('button', { name: /envoyer/i }).click();

    // Expect message bubble showing
    // await expect(page.getByText('Hello')).toBeVisible();
  });
});
