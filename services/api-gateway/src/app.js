const express = require('express');
const authRouter = require('./routes/auth.routes')
const userRouter = require('./routes/user.routes')
const productRouter = require('./routes/product.routes')
const orderRouter = require('./routes/order.routes')
const cors = require('cors');
const { authLimiter, userLimiter, productLimiter, orderLimiter, globalLimiter } = require('./config/limiter');
const { authThrottle, orderThrottle, productThrottle, userThrottle } = require('./config/throttle');


const app = express();
app.use(express.json())
app.set("trust proxy", 1);
app.use(cors({ origin: '*' }));
app.use(globalLimiter);

app.use('/auth', authThrottle, authLimiter, authRouter);
app.use('/users', userThrottle, userLimiter, userRouter);
app.use('/products', productThrottle, productLimiter, productRouter);
app.use('/orders', orderThrottle, orderLimiter, orderRouter);

module.exports = app;
