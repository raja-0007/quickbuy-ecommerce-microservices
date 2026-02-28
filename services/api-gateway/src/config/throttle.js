const slowDown = require("express-slow-down");
const { ipKeyGenerator } = require("express-rate-limit");

const createThrottle = ({ windowMs, delayAfter, delayMs }) =>
  slowDown({
    windowMs,        // time window
    delayAfter,      // allow this many requests without delay
    delayMs: () => delayMs,

    keyGenerator: (req, res) => {
      if (req.user?.id) {
        return `user-${req.user.id}`;
      }
      return ipKeyGenerator(req, res);
    },
  });

  const authThrottle = createThrottle({
  windowMs: 1000,     // 1 second
  delayAfter: 3,      // 3 requests allowed instantly
  delayMs: 500,       // add 500ms delay per extra request
});

const orderThrottle = createThrottle({
  windowMs: 1000,
  delayAfter: 5,
  delayMs: 300,
});

const productThrottle = createThrottle({
  windowMs: 1000,
  delayAfter: 10,
  delayMs: 200,
});
const userThrottle = createThrottle({
  windowMs: 1000,
  delayAfter: 10,
  delayMs: 200,
});


module.exports = { authThrottle, orderThrottle, productThrottle, userThrottle };