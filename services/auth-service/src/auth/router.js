const router = require('express').Router();
const authController = require('./controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/auth-login', authController.externalLogin);
router.get('/me', authController.getMe);

module.exports = router;