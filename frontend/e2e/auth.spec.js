import { test, expect } from '@playwright/test';
import { TEST_USER } from './helpers/testData.js';
import { registerAndLogin, loginUser, signupUser } from './helpers/auth.js';

// Each auth test gets its own unique user to avoid cross-test interference
function uniqueUser(suffix) {
  return { username: `${TEST_USER.username}_auth_${suffix}`, password: TEST_USER.password };
}

test.describe('Signup', () => {
  test('signup page renders form', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('shows error when fields are empty', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toContainText(/required/i);
  });

  test('successful signup redirects to /login', async ({ page }) => {
    const user = uniqueUser('new');
    await page.goto('/signup');
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.waitForURL('/login', { timeout: 10_000 });
    await expect(page).toHaveURL('/login');
  });

  test('duplicate username shows error', async ({ page }) => {
    const user = uniqueUser('dup');
    // First signup
    await signupUser(page, user);
    // Second signup with same username
    await page.goto('/signup');
    await page.getByLabel('Username').fill(user.username);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 });
  });
});

test.describe('Login', () => {
  test('login page renders form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('shows error when fields are empty', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('alert')).toContainText(/required/i);
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('nonexistent_user_xyz');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 });
  });

  test('successful login redirects to /products', async ({ page }) => {
    const user = uniqueUser('login');
    await registerAndLogin(page, user);
    await expect(page).toHaveURL('/products');
  });

  test('authenticated navigation is visible after login', async ({ page }) => {
    const user = uniqueUser('nav');
    await registerAndLogin(page, user);
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  });
});

test.describe('Session persistence', () => {
  test('session survives page refresh', async ({ page }) => {
    const user = uniqueUser('session');
    await registerAndLogin(page, user);
    await page.reload();
    await expect(page).toHaveURL('/products');
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('protected route accessible when authenticated', async ({ page }) => {
    const user = uniqueUser('protected');
    await registerAndLogin(page, user);
    await page.goto('/products/new');
    await expect(page).toHaveURL('/products/new');
    await expect(page.getByRole('heading', { name: 'Add Product' })).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('logout redirects to /login', async ({ page }) => {
    const user = uniqueUser('logout');
    await registerAndLogin(page, user);
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login', { timeout: 8_000 });
    await expect(page).toHaveURL('/login');
  });

  test('after logout /products redirects to /login', async ({ page }) => {
    const user = uniqueUser('logoutredir');
    await registerAndLogin(page, user);
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login', { timeout: 8_000 });
    await page.goto('/products');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Protected routes (unauthenticated)', () => {
  for (const route of ['/products', '/products/new']) {
    test(`${route} redirects to /login when not authenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL('/login');
    });
  }
});
