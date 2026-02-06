const express = require('express')
const controllers = require('./controller')

const router = express.Router()

router.get('/deals/home', controllers.getHomeDeals)
router.get('/categories', controllers.getCategories)

router.get('/get-products', controllers.getAllProducts)
router.get('/search-products', controllers.searchProducts)
router.get('/getProduct/:id', controllers.getProductById)

router.post('/add-product', controllers.addProduct)

router.put('/update-product/:id', controllers.updateProduct)

router.delete('/delete-product/:id', controllers.deleteProduct) 

module.exports = router