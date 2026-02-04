const express = require('express');
const controllers = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth')

const router = express.Router();

router.get('/getAllUsers',controllers.getAllUsers);
router.get('/getProfile/:userId',authMiddleware, controllers.getProfile);
router.post('/createUser',controllers.createUser);
router.put('/updateUser/:id',authMiddleware, controllers.updateUser);
router.delete('/deleteUser/:id',authMiddleware, controllers.deleteUser);

module.exports = router;