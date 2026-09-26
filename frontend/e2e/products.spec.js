import { test, expect } from '@playwright/test';
import { TEST_USER, TEST_PRODUCT, UPDATED_PRODUCT } from './helpers/testData.js';
import { registerAndLogin } from './helpers/auth.js';

// Shared user for all product tests in this file
const USER = { username: `${TEST_USER.username}_prod`, password: TEST_USER.password };

test.describe('Product CRUD', () => {
  // Register once before all tests in this suite
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await registerAndLogin(page, USER);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Ensure we are logged in before each test
    const { loginUser } = await import('./helpers/auth.js');
    await loginUser(page, USER);
  });

  // ── CREATE ──────────────────────────────────────────────────────────────────

  test('Add Product page loads', async ({ page }) => {
    await page.getByRole('button', { name: 'Add Product' }).click();
    await expect(page).toHaveURL('/products/new');
    await expect(page.getByRole('heading', { name: 'Add Product' })).toBeVisible();
  });

  test('creates a product with all fields', async ({ page }) => {
    await page.goto('/products/new');

    await page.getByLabel('Meta Title').fill(TEST_PRODUCT.metaTitle);
    await page.getByLabel('Product Name').fill(TEST_PRODUCT.productName);
    await page.getByLabel('Product Slug').fill(TEST_PRODUCT.productSlug);

    // Gallery images
    await page.getByLabel('Gallery image URL 1').fill(TEST_PRODUCT.imageUrl);
    await page.getByRole('button', { name: 'Add image URL' }).click();
    await page.getByLabel('Gallery image URL 2').fill(TEST_PRODUCT.imageUrl2);
    await page.getByRole('button', { name: 'Add image URL' }).click();
    await page.getByLabel('Gallery image URL 3').fill(TEST_PRODUCT.imageUrl3);

    await page.getByLabel('Price').fill(TEST_PRODUCT.price);
    await page.getByLabel('Discounted price').fill(TEST_PRODUCT.discountedPrice);

    // CKEditor — click into the editable area and type
    const editor = page.locator('.ck-editor__editable');
    await editor.click();
    await editor.type(TEST_PRODUCT.description);

    await page.getByRole('button', { name: 'Create Product' }).click();

    // Should redirect to product detail
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText(TEST_PRODUCT.productName);
  });

  // ── READ ─────────────────────────────────────────────────────────────────────

  test('product appears in products list', async ({ page }) => {
    await page.goto('/products');
    await expect(page.getByText(TEST_PRODUCT.productName)).toBeVisible({ timeout: 10_000 });
  });

  test('product detail shows all fields', async ({ page }) => {
    await page.goto('/products');
    await page.getByText(TEST_PRODUCT.productName).first().click();
    // Wait for detail page
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 8_000 });

    await expect(page.getByRole('heading', { level: 1 })).toContainText(TEST_PRODUCT.productName);
    await expect(page.getByText(TEST_PRODUCT.metaTitle)).toBeVisible();
    await expect(page.getByText(TEST_PRODUCT.productSlug)).toBeVisible();
    await expect(page.getByText(TEST_PRODUCT.description)).toBeVisible();
  });

  // ── UPDATE ───────────────────────────────────────────────────────────────────

  test('edits a product and shows updated values', async ({ page }) => {
    // Navigate to the test product detail
    await page.goto('/products');
    await page.getByText(TEST_PRODUCT.productName).first().click();
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 8_000 });

    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}\/edit$/, { timeout: 8_000 });

    // Update product name
    const nameField = page.getByLabel('Product Name');
    await nameField.clear();
    await nameField.fill(UPDATED_PRODUCT.productName);

    // Update price
    const priceField = page.getByLabel('Price');
    await priceField.clear();
    await priceField.fill(UPDATED_PRODUCT.price);

    // Update CKEditor description
    const editor = page.locator('.ck-editor__editable');
    await editor.click();
    await page.keyboard.press('Control+A');
    await editor.type(UPDATED_PRODUCT.description);

    await page.getByRole('button', { name: 'Save Changes' }).click();

    // Should redirect back to detail
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { level: 1 })).toContainText(UPDATED_PRODUCT.productName);
    await expect(page.getByText(UPDATED_PRODUCT.description)).toBeVisible();
  });

  // ── DUPLICATE SLUG (backend validation through UI) ───────────────────────────

  test('duplicate slug shows backend error in UI', async ({ page }) => {
    await page.goto('/products/new');

    // Use the same slug as the already-created product
    await page.getByLabel('Meta Title').fill('Duplicate Slug Test');
    await page.getByLabel('Product Name').fill('Duplicate Slug Product');
    await page.getByLabel('Product Slug').fill(TEST_PRODUCT.productSlug); // duplicate
    await page.getByLabel('Gallery image URL 1').fill(TEST_PRODUCT.imageUrl);
    await page.getByLabel('Price').fill('500');

    const editor = page.locator('.ck-editor__editable');
    await editor.click();
    await editor.type('Some description');

    await page.getByRole('button', { name: 'Create Product' }).click();

    // Backend returns 409 — frontend should show an error alert
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 8_000 });
    // Still on /products/new — not redirected
    await expect(page).toHaveURL('/products/new');
  });

  // ── DELETE ───────────────────────────────────────────────────────────────────

  test('deletes a product after confirmation', async ({ page }) => {
    await page.goto('/products');

    // Find the updated product name card and click Delete
    const card = page.locator('[class*="MuiCard"]').filter({
      hasText: UPDATED_PRODUCT.productName,
    });
    await card.getByRole('button', { name: 'Delete' }).click();

    // Confirm dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).last().click();

    // Product should disappear from the list
    await expect(page.getByText(UPDATED_PRODUCT.productName)).not.toBeVisible({ timeout: 8_000 });
  });
});
