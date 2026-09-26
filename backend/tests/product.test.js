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

const INVALID_ID = '000000000000000000000000';
const MALFORMED_ID = 'not-an-id';

const getToken = async () => {
  await request(app).post('/api/auth/signup').send({ username: 'testuser', password: 'Test@12345' });
  const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'Test@12345' });
  return res.body.data.token;
};

describe('POST /api/products', () => {
  it('should create a product with valid payload and token', async () => {
    const token = await getToken();
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(validProduct);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.productName).toBe(validProduct.productName);
    expect(res.body.data.product.productSlug).toBe(validProduct.productSlug);
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).post('/api/products').send(validProduct);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/products', () => {
  it('should return products array with valid token', async () => {
    const token = await getToken();
    const res = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.products)).toBe(true);
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/products/:id', () => {
  it('should return a product by valid ID', async () => {
    const token = await getToken();
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(validProduct);
    const id = created.body.data.product._id;

    const res = await request(app).get(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.product._id).toBe(id);
  });

  it('should return 400 for malformed ID', async () => {
    const token = await getToken();
    const res = await request(app).get(`/api/products/${MALFORMED_ID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existing product', async () => {
    const token = await getToken();
    const res = await request(app).get(`/api/products/${INVALID_ID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).get(`/api/products/${INVALID_ID}`);
    expect(res.status).toBe(401);
  });
});

describe('PUT /api/products/:id', () => {
  it('should update a product with valid payload', async () => {
    const token = await getToken();
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(validProduct);
    const id = created.body.data.product._id;

    const res = await request(app)
      .put(`/api/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productName: 'Updated Name' });
    expect(res.status).toBe(200);
    expect(res.body.data.product.productName).toBe('Updated Name');
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).put(`/api/products/${INVALID_ID}`).send({ productName: 'Updated' });
    expect(res.status).toBe(401);
  });

  it('should return 400 for malformed ID', async () => {
    const token = await getToken();
    const res = await request(app)
      .put(`/api/products/${MALFORMED_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productName: 'Updated' });
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existing product', async () => {
    const token = await getToken();
    const res = await request(app)
      .put(`/api/products/${INVALID_ID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productName: 'Updated' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/products/:id', () => {
  it('should delete a product successfully', async () => {
    const token = await getToken();
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(validProduct);
    const id = created.body.data.product._id;

    const res = await request(app).delete(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 after deleting — product no longer exists', async () => {
    const token = await getToken();
    const created = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send(validProduct);
    const id = created.body.data.product._id;

    await request(app).delete(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    const res = await request(app).get(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('should return 401 without authentication', async () => {
    const res = await request(app).delete(`/api/products/${INVALID_ID}`);
    expect(res.status).toBe(401);
  });

  it('should return 400 for malformed ID', async () => {
    const token = await getToken();
    const res = await request(app).delete(`/api/products/${MALFORMED_ID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it('should return 404 for non-existing product', async () => {
    const token = await getToken();
    const res = await request(app).delete(`/api/products/${INVALID_ID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
