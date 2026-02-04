const express = require('express');
const controllers = require('./controller');
const router = express.Router();

router.get('/getAllUsers', controllers.getAllUsers);
router.get('/getProfile/:userId', controllers.getProfile);
router.post('/createUser', controllers.createUser);
router.put('/updateUser/:id', controllers.updateUser);
router.delete('/deleteUser/:id', controllers.deleteUser);

module.exports = router;