const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

beforeAll(async () => {
  process.env.JWT_SECRET = 'test_jwt_secret_key';
  const uri = fs.readFileSync(path.join(__dirname, '.mongo-test-uri'), 'utf-8');
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
