import { test, expect } from '@playwright/test';
import { TEST_USER, TEST_PRODUCT } from './helpers/testData.js';
import { registerAndLogin, loginUser } from './helpers/auth.js';

const USER = { username: `${TEST_USER.username}_val`, password: TEST_USER.password };

test.describe('Frontend Validation', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await registerAndLogin(page, USER);
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await loginUser(page, USER);
    await page.goto('/products/new');
  });

  test('empty form shows all required field errors', async ({ page }) => {
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText('Meta title is required.')).toBeVisible();
    await expect(page.getByText('Product name is required.')).toBeVisible();
    await expect(page.getByText('Product slug is required.')).toBeVisible();
    await expect(page.getByText('At least one image URL is required.')).toBeVisible();
    await expect(page.getByText('Price is required.')).toBeVisible();
    await expect(page.getByText('Description is required.')).toBeVisible();
  });

  test('invalid slug format shows error', async ({ page }) => {
    await page.getByLabel('Product Slug').fill('Invalid Slug With Spaces!');
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText(/slug must be lowercase/i)).toBeVisible();
  });

  test('invalid image URL shows error', async ({ page }) => {
    await page.getByLabel('Gallery image URL 1').fill('not-a-url');
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText(/valid URL/i)).toBeVisible();
  });

  test('negative price shows error', async ({ page }) => {
    await page.getByLabel('Price').fill('-10');
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText(/positive number/i)).toBeVisible();
  });

  test('discounted price greater than price shows error', async ({ page }) => {
    await page.getByLabel('Price').fill('100');
    await page.getByLabel('Discounted price').fill('200');
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText(/less than the price/i)).toBeVisible();
  });

  test('empty CKEditor description shows error', async ({ page }) => {
    // Fill all other fields validly
    await page.getByLabel('Meta Title').fill('Test Meta');
    await page.getByLabel('Product Name').fill('Test Product');
    await page.getByLabel('Product Slug').fill(`test-slug-${Date.now()}`);
    await page.getByLabel('Gallery image URL 1').fill('https://example.com/img.jpg');
    await page.getByLabel('Price').fill('100');
    // Leave CKEditor empty — do not type anything
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page.getByText('Description is required.')).toBeVisible();
  });

  test('form does not submit with invalid data', async ({ page }) => {
    // Submit empty form and verify we stay on /products/new
    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page).toHaveURL('/products/new');
  });
});

test.describe('CKEditor Integration', () => {
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await registerAndLogin(page, USER);
    await page.close();
  });

  test('CKEditor loads on Add Product page', async ({ page }) => {
    await loginUser(page, USER);
    await page.goto('/products/new');
    await expect(page.locator('.ck-editor')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.ck-toolbar')).toBeVisible();
  });

  test('CKEditor accepts formatted content and product is created', async ({ page }) => {
    await loginUser(page, USER);
    await page.goto('/products/new');

    const slug = `ck-test-${Date.now()}`;
    await page.getByLabel('Meta Title').fill('CKEditor Test');
    await page.getByLabel('Product Name').fill('CKEditor Test Product');
    await page.getByLabel('Product Slug').fill(slug);
    await page.getByLabel('Gallery image URL 1').fill('https://picsum.photos/400/300');
    await page.getByLabel('Price').fill('500');

    const editor = page.locator('.ck-editor__editable');
    await editor.click();
    await editor.type('Rich text description');

    await page.getByRole('button', { name: 'Create Product' }).click();
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 15_000 });
    await expect(page.getByText('Rich text description')).toBeVisible();
  });

  test('Edit Product loads existing description into CKEditor', async ({ page }) => {
    await loginUser(page, USER);
    // Find the CKEditor test product
    await page.goto('/products');
    await page.getByText('CKEditor Test Product').first().click();
    await expect(page).toHaveURL(/\/products\/[a-f0-9]{24}$/, { timeout: 8_000 });
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/\/edit$/, { timeout: 8_000 });

    // CKEditor should contain the existing description
    const editor = page.locator('.ck-editor__editable');
    await expect(editor).toContainText('Rich text description', { timeout: 8_000 });
  });
});

test.describe('Responsive Layout', () => {
  const MOBILE = { width: 390, height: 844 };
  const DESKTOP = { width: 1280, height: 800 };

  async function checkNoHorizontalOverflow(page) {
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  }

  for (const [label, viewport] of [['desktop', DESKTOP], ['mobile', MOBILE]]) {
    test(`Login page — no overflow on ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/login');
      await expect(page.getByLabel('Username')).toBeVisible();
      await checkNoHorizontalOverflow(page);
    });

    test(`Signup page — no overflow on ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/signup');
      await expect(page.getByLabel('Username')).toBeVisible();
      await checkNoHorizontalOverflow(page);
    });

    test(`Products page — no overflow on ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await loginUser(page, USER);
      await checkNoHorizontalOverflow(page);
    });

    test(`Add Product page — no overflow on ${label}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await loginUser(page, USER);
      await page.goto('/products/new');
      await expect(page.locator('.ck-editor')).toBeVisible({ timeout: 10_000 });
      await checkNoHorizontalOverflow(page);
    });
  }
});
