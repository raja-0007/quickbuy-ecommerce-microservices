const express = require('express')
const router = require("./user_handlers/router")

const app = express()

app.use(express.json())
app.use("/users", router)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' })
})

module.exports = app
