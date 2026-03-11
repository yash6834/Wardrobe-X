const rateLimit = require("express-rate-limit");

exports.paymentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Too many payment attempts. Try again later."
});