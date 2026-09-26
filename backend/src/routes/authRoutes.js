const router = require('express').Router();
const { signup, login, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
