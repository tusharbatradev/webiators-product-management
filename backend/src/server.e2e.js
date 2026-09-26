require('dotenv').config({ path: require('path').join(__dirname, '../.env.test') });
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5001;

const start = async () => {
  await connectDB();

  // Wipe the isolated test database before the E2E run starts
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  app.listen(PORT, () => {
    console.log(`E2E backend running on port ${PORT} (test DB)`);
  });
};

start();
