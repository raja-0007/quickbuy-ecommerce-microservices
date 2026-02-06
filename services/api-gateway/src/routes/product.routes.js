const express = require('express');
const axios = require('axios');
const authMiddleware = require('../middlewares/auth')
const roleCheck = require('../middlewares/roleCheck')
const productController = require('../controllers/product.controller')


const router = express.Router();

router.get('/deals/home', productController.getHomeDeals);

router.get('/categories', productController.getCategories);

router.get('/get-products', productController.getAllProducts);

router.get('/search-products', productController.searchProducts);

router.get('/getProduct/:id', productController.getProductById);

router.post('/add-product', authMiddleware, roleCheck(['admin', 'seller']), productController.addProduct);

router.put('/update-product/:id', authMiddleware, roleCheck(['admin', 'seller']), productController.updateProduct);

router.delete('/delete-product/:id', authMiddleware, roleCheck(['admin']), productController.deleteProduct)


module.exports = router;