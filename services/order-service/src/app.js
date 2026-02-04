import express from 'express';
import router from './order_handlers/router.js';
import cartRouter from './cart_handlers/router.js';
const app = express()


app.use(express.json())
app.use('/orders', router)
app.use('/orders/cart', cartRouter)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' })
})

export default app
