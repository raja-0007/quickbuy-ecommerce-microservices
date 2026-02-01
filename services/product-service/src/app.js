const express = require('express')
const productRouter = require('./product_handlers/router')
const app = express()

app.use(express.json())
app.use('/products', productRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})
module.exports = app
