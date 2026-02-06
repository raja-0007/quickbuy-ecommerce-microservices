const express = require('express');
const controllers = require('../controllers/order.controller')
const cartControllers = require('../controllers/cart.controller')
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

const router = express.Router();

router.get('/getAllOrders', authMiddleware, roleCheck(['admin', 'seller']), controllers.getAllOrders);
router.get('/getUserOrders/:userId',authMiddleware, controllers.getMyOrders);
router.get('/getOrder/:orderId',authMiddleware, controllers.getOrderById);
router.post('/createOrder',authMiddleware, controllers.createOrder);
router.put('/updateOrder/:orderId',authMiddleware, roleCheck(['admin', 'seller']), controllers.updateOrder);
router.delete('/deleteOrder/:orderId',authMiddleware, roleCheck(['admin']), controllers.deleteOrder);

router.post('/cart/addToCart',authMiddleware, cartControllers.addToCart);
router.get('/cart/getCart',authMiddleware, cartControllers.getCart);
router.put('/cart/updateCartItem',authMiddleware, cartControllers.updateCartItem);
router.delete('/cart/deleteCartItem/:productId',authMiddleware, cartControllers.deleteCartItem);


module.exports = router;