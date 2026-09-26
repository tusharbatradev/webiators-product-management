// Unique suffix per test run to avoid collisions in the shared test DB
const RUN_ID = Date.now();

export const TEST_USER = {
  username: `e2euser${RUN_ID}`,
  password: 'TestPass123',
};

export const TEST_PRODUCT = {
  metaTitle: `E2E Product Meta ${RUN_ID}`,
  productName: `E2E Product ${RUN_ID}`,
  productSlug: `e2e-product-${RUN_ID}`,
  imageUrl: 'https://picsum.photos/seed/e2e1/400/300',
  imageUrl2: 'https://picsum.photos/seed/e2e2/400/300',
  imageUrl3: 'https://picsum.photos/seed/e2e3/400/300',
  price: '999',
  discountedPrice: '799',
  description: 'E2E test product description',
};

export const UPDATED_PRODUCT = {
  productName: `E2E Updated ${RUN_ID}`,
  price: '1299',
  description: 'Updated E2E description',
};
