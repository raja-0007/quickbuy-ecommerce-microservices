const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const createLimiter = ({ windowMs, max, message }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req, res) => {
            if (req.user?.id) {
                return `user-${req.user.id}`;
            }
            return ipKeyGenerator(req, res);
        },
        message: {
            success: false,
            message: message || "Too many requests. Please try again later.",
        },
    });


const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: "Too many authentication attempts. Try again later.",
});

const userLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 150,
});


const productLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 400,
});


const orderLimiter = createLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 120,
});


const globalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 800,
});

module.exports = { authLimiter, userLimiter, productLimiter, orderLimiter, globalLimiter };