const express = require('express')
const connectDB = require('./config/db')
const AuthRouter = require('./auth/router');
const cors = require('cors');
const app = express()

app.use(express.json())
app.use(cors({ origin: '*' }));
app.use('/auth', AuthRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})

module.exports = app
