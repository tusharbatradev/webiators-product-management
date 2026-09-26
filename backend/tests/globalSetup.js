// globalSetup runs in an isolated context in Jest 30.
// MongoMemoryServer lifecycle is handled in setup.js (setupFilesAfterEnv)
// so it runs in the same worker process as the tests.
module.exports = async () => {};

