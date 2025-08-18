import { test, expect } from '@playwright/test';

test.describe('Authentication Flow Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*connexion/);
  });

  test('should handle login flow correctly', async ({ page }) => {
    await page.goto('/connexion');
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Should redirect to dashboard or pending approval
    await expect(page).toHaveURL(/\/(dashboard|en-attente-approbation)/);
  });

  test('should show pending approval page for unapproved users', async ({ page }) => {
    // Mock unapproved user session
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { id: 'test-user', email: 'test@example.com' },
        session: { access_token: 'mock-token' }
      }));
    });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*en-attente-approbation/);
    await expect(page.locator('text=En attente d\'approbation')).toBeVisible();
  });

  test('should redirect approved users to dashboard', async ({ page }) => {
    // Mock approved user session
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { id: 'approved-user', email: 'approved@example.com' },
        session: { access_token: 'mock-token' }
      }));
    });

    await page.goto('/en-attente-approbation');
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should handle role-based access correctly', async ({ page }) => {
    // Mock platform admin user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { 
          id: 'admin-user', 
          email: 'admin@example.com',
          user_metadata: { role: 'platform_admin' }
        },
        session: { access_token: 'mock-token' }
      }));
    });

    await page.goto('/dashboard/students');
    await expect(page).toHaveURL(/.*dashboard\/students/);
  });

  test('should prevent unauthorized role access', async ({ page }) => {
    // Mock teacher user trying to access admin-only page
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { 
          id: 'teacher-user', 
          email: 'teacher@example.com',
          user_metadata: { role: 'teacher' }
        },
        session: { access_token: 'mock-token' }
      }));
    });

    await page.goto('/dashboard/students');
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard$/);
  });

  test('should handle logout correctly', async ({ page }) => {
    // Mock authenticated user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { id: 'test-user', email: 'test@example.com' },
        session: { access_token: 'mock-token' }
      }));
    });

    await page.goto('/dashboard');
    
    // Click logout button
    await page.click('[data-testid="logout-button"]');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Should clear auth state
    const token = await page.evaluate(() => 
      window.localStorage.getItem('supabase.auth.token')
    );
    expect(token).toBeNull();
  });

  test('should handle session expiry gracefully', async ({ page }) => {
    // Mock expired session
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: null,
        session: null
      }));
    });

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*connexion/);
  });
});
