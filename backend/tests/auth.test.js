const request = require('supertest');
const app = require('../src/app');

const validUser = { username: 'testuser', password: 'Test@12345' };

describe('POST /api/auth/signup', () => {
  it('should register a new user and return 201', async () => {
    const res = await request(app).post('/api/auth/signup').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe(validUser.username);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 409 for duplicate username', async () => {
    await request(app).post('/api/auth/signup').send(validUser);
    const res = await request(app).post('/api/auth/signup').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing username', async () => {
    const res = await request(app).post('/api/auth/signup').send({ password: 'Test@12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing password', async () => {
    const res = await request(app).post('/api/auth/signup').send({ username: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for password shorter than 6 characters', async () => {
    const res = await request(app).post('/api/auth/signup').send({ username: 'testuser', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for username shorter than 3 characters', async () => {
    const res = await request(app).post('/api/auth/signup').send({ username: 'ab', password: 'Test@12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(validUser);
  });

  it('should login successfully and return a JWT token', async () => {
    const res = await request(app).post('/api/auth/login').send(validUser);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.username).toBe(validUser.username);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 401 for incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for non-existing username', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nobody', password: 'Test@12345' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing username', async () => {
    const res = await request(app).post('/api/auth/login').send({ password: 'Test@12345' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 for missing password', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/auth/me', () => {
  let token;

  beforeEach(async () => {
    await request(app).post('/api/auth/signup').send(validUser);
    const res = await request(app).post('/api/auth/login').send(validUser);
    token = res.body.data.token;
  });

  it('should return current user with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe(validUser.username);
    expect(res.body.data.user.password).toBeUndefined();
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
