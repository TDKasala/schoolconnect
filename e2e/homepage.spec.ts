import { test, expect } from '@playwright/test';

test('homepage has correct title and navigation', async ({ page }) => {
  await page.goto('/');
  
  // Expect the page to have the correct title
  await expect(page).toHaveTitle(/SchoolConnect/);
  
  // Check for key elements on the homepage
  await expect(page.getByText('Une solution complète pour la gestion scolaire')).toBeVisible();
  
  // Check navigation links
  await expect(page.getByRole('link', { name: 'Pedagogie' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Finances' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Portails' })).toBeVisible();
  
  // Test navigation to pedagogy page
  await page.getByRole('link', { name: 'Pedagogie' }).click();
  await expect(page).toHaveURL(/.*pedagogie/);
});

test('user can navigate to auth pages', async ({ page }) => {
  await page.goto('/');
  
  // Test navigation to login page
  await page.getByRole('link', { name: 'Connexion' }).click();
  await expect(page).toHaveURL(/.*connexion/);
  await expect(page.getByText('Connexion à votre compte')).toBeVisible();
  
  // Test navigation to register page
  await page.goto('/');
  await page.getByRole('link', { name: 'Inscription' }).click();
  await expect(page).toHaveURL(/.*inscription/);
  await expect(page.getByText('Créer un compte')).toBeVisible();
});
