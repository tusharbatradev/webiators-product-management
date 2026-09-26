/**
 * Performs signup then login for a given user.
 * Safe to call multiple times — duplicate username errors are swallowed.
 */
export async function signupUser(page, user) {
  await page.goto('/signup');
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Create account' }).click();
  // Wait for redirect to /login or an error (duplicate user is fine)
  await page.waitForURL(/\/(login|signup)/, { timeout: 10_000 });
}

/**
 * Logs in and waits for redirect to /products.
 */
export async function loginUser(page, user) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('/products', { timeout: 10_000 });
}

/**
 * Signs up then logs in — convenience wrapper for test setup.
 */
export async function registerAndLogin(page, user) {
  await signupUser(page, user);
  await loginUser(page, user);
}
