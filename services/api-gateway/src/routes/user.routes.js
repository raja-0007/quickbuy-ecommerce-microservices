const express = require('express');
const controllers = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth')
const roleCheck = require('../middlewares/roleCheck')

const router = express.Router();

router.get('/getAllUsers',controllers.getAllUsers);
router.get('/getProfile',authMiddleware, controllers.getProfile);
router.post('/createUser',authMiddleware, controllers.createUser);
router.put('/updateUser',authMiddleware, controllers.updateUser);
router.put('/updateAddress',authMiddleware, controllers.updateAddress);
router.delete('/deleteUser/:id',authMiddleware, roleCheck(['admin']), controllers.deleteUser);
router.put('/updateRole/:userId', authMiddleware, roleCheck(['admin']), controllers.updateUserRole);
router.put('/updateStatus/:userId', authMiddleware, roleCheck(['admin']), controllers.updateUserStatus);

module.exports = router;