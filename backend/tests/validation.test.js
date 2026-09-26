const request = require('supertest');
const app = require('../src/app');

const validProduct = {
  metaTitle: 'Test Product',
  productName: 'Test Product',
  productSlug: 'test-product',
  galleryImages: ['https://example.com/product-1.jpg'],
  price: 1000,
  discountedPrice: 800,
  description: '<p>Test product description</p>',
};

const getToken = async () => {
  await request(app).post('/api/auth/signup').send({ username: 'testuser', password: 'Test@12345' });
  const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'Test@12345' });
  return res.body.data.token;
};

describe('GET /api/health', () => {
  it('should return 200 with success message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('API is running');
  });
});

describe('Product validation — POST /api/products', () => {
  let token;
  beforeEach(async () => { token = await getToken(); });

  const post = (body) =>
    request(app).post('/api/products').set('Authorization', `Bearer ${token}`).send(body);

  it('should return 400 for missing metaTitle', async () => {
    const { metaTitle, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for empty metaTitle', async () => {
    expect((await post({ ...validProduct, metaTitle: '' })).status).toBe(400);
  });

  it('should return 400 for missing productName', async () => {
    const { productName, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for empty productName', async () => {
    expect((await post({ ...validProduct, productName: '' })).status).toBe(400);
  });

  it('should return 400 for missing productSlug', async () => {
    const { productSlug, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for invalid productSlug with spaces', async () => {
    expect((await post({ ...validProduct, productSlug: 'Premium Cotton Shirt' })).status).toBe(400);
  });

  it('should return 400 for invalid productSlug with uppercase', async () => {
    expect((await post({ ...validProduct, productSlug: 'Premium-Shirt' })).status).toBe(400);
  });

  it('should return 400 for missing galleryImages', async () => {
    const { galleryImages, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for empty galleryImages array', async () => {
    expect((await post({ ...validProduct, galleryImages: [] })).status).toBe(400);
  });

  it('should return 400 for invalid gallery image URL', async () => {
    expect((await post({ ...validProduct, galleryImages: ['not-a-url'] })).status).toBe(400);
  });

  it('should return 400 for missing price', async () => {
    const { price, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for negative price', async () => {
    expect((await post({ ...validProduct, price: -100 })).status).toBe(400);
  });

  it('should return 400 for zero price', async () => {
    expect((await post({ ...validProduct, price: 0 })).status).toBe(400);
  });

  it('should return 400 for string price', async () => {
    expect((await post({ ...validProduct, price: 'free' })).status).toBe(400);
  });

  it('should return 400 for negative discountedPrice', async () => {
    expect((await post({ ...validProduct, discountedPrice: -50 })).status).toBe(400);
  });

  it('should return 400 for discountedPrice greater than price', async () => {
    expect((await post({ ...validProduct, price: 1000, discountedPrice: 1200 })).status).toBe(400);
  });

  it('should return 400 for missing description', async () => {
    const { description, ...body } = validProduct;
    expect((await post(body)).status).toBe(400);
  });

  it('should return 400 for empty description', async () => {
    expect((await post({ ...validProduct, description: '' })).status).toBe(400);
  });

  it('should return 409 for duplicate productSlug', async () => {
    await post(validProduct);
    const res = await post(validProduct);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('validation error response should contain errors array', async () => {
    const { metaTitle, ...body } = validProduct;
    const res = await post(body);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors[0]).toHaveProperty('field');
    expect(res.body.errors[0]).toHaveProperty('message');
  });
});

describe('Security tests', () => {
  it('should return 401 for product route with malformed JWT', async () => {
    const res = await request(app).get('/api/products').set('Authorization', 'Bearer malformed.jwt.token');
    expect(res.status).toBe(401);
  });

  it('should return 401 for product route with no Authorization header', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });

  it('signup response should never include password', async () => {
    const res = await request(app).post('/api/auth/signup').send({ username: 'sectest', password: 'Test@12345' });
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('login response should never include password', async () => {
    await request(app).post('/api/auth/signup').send({ username: 'sectest', password: 'Test@12345' });
    const res = await request(app).post('/api/auth/login').send({ username: 'sectest', password: 'Test@12345' });
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('/me response should never include password', async () => {
    await request(app).post('/api/auth/signup').send({ username: 'sectest', password: 'Test@12345' });
    const login = await request(app).post('/api/auth/login').send({ username: 'sectest', password: 'Test@12345' });
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.data.token}`);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('error responses should not expose stack traces', async () => {
    const res = await request(app).get('/api/products/malformed-id').set('Authorization', 'Bearer bad');
    expect(res.body.stack).toBeUndefined();
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
