const router = require('express').Router();
const authController = require('./controller');
const authMiddleware = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authController.getMe);

module.exports = router;