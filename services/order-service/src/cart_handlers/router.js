import express from 'express';
import controllers from './controller.js';
const router = express.Router();

// router.get('/getAllOrders', controllers.getAllOrders);
// router.get('/getUserOrders/:userId', controllers.getMyOrders);
// router.get('/getOrder/:orderId', controllers.getOrderById);
// router.post('/createOrder', controllers.createOrder);
// router.put('/updateOrder/:orderId', controllers.updateOrder);
// router.delete('/deleteOrder/:orderId', controllers.deleteOrder);

router.post('/addToCart', controllers.addToCart);
export default router;

