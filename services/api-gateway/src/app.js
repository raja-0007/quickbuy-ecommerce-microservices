const express = require('express');
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/product.routes')
const cors = require('cors');

const app = express();
app.use(express.json())
app.use(cors({ origin: '*' }));

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);

module.exports = app;
