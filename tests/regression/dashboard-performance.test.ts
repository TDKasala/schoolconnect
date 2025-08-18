import { test, expect } from '@playwright/test';

test.describe('Dashboard Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated platform admin user
    await page.addInitScript(() => {
      window.localStorage.setItem('supabase.auth.token', JSON.stringify({
        user: { 
          id: 'admin-user', 
          email: 'admin@example.com',
          user_metadata: { role: 'platform_admin', approved: true }
        },
        session: { access_token: 'mock-token' }
      }));
    });
  });

  test('dashboard should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    
    // Wait for main content to be visible
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should not show flicker during initial load', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check that skeleton loading is shown initially
    const skeleton = page.locator('[data-testid="dashboard-skeleton"]');
    await expect(skeleton).toBeVisible();
    
    // Wait for actual content to load
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
    
    // Skeleton should be hidden
    await expect(skeleton).not.toBeVisible();
  });

  test('should handle concurrent data fetches efficiently', async ({ page }) => {
    // Monitor network requests
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/rest/v1/')) {
        requests.push(request.url());
      }
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should not have duplicate requests for the same resource
    const uniqueRequests = [...new Set(requests)];
    expect(requests.length).toBeLessThanOrEqual(uniqueRequests.length + 2); // Allow minimal duplication
  });

  test('should maintain responsive UI during data loading', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click on different sections while data is loading
    await page.click('[data-testid="stats-section"]');
    await page.click('[data-testid="activity-section"]');
    
    // UI should remain responsive
    const button = page.locator('[data-testid="refresh-button"]');
    await expect(button).toBeEnabled();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/rest/v1/**', route => {
      route.abort('failed');
    });

    await page.goto('/dashboard');
    
    // Should show error boundary or error message
    await expect(page.locator('text=Erreur')).toBeVisible();
    
    // Should provide retry option
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('should optimize re-renders on data updates', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for initial load
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
    
    // Trigger data refresh
    await page.click('[data-testid="refresh-button"]');
    
    // Should show loading indicator without full page re-render
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
  });

  test('should handle role switching efficiently', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Switch to different role view (if applicable)
    const roleSelector = page.locator('[data-testid="role-selector"]');
    if (await roleSelector.isVisible()) {
      await roleSelector.selectOption('school_admin');
      
      // Should update content without full page reload
      await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
    }
  });

  test('should maintain state during navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Interact with dashboard
    await page.fill('[data-testid="search-input"]', 'test query');
    
    // Navigate to sub-page and back
    await page.click('[data-testid="students-link"]');
    await page.goBack();
    
    // Should maintain search state
    const searchValue = await page.inputValue('[data-testid="search-input"]');
    expect(searchValue).toBe('test query');
  });
});
