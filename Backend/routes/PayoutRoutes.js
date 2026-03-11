const express = require("express");
const router = express.Router();

const {
  payVendor,
  getVendorPayouts,
  getAllPayouts,
  paymentFailed
} = require("../controller/PayoutController");

const {
  protect,
  adminOnly,
  vendorOnly,
} = require("../middlewares/authMiddleware");

const { captureDevice } = require("../middlewares/DeviceTracker");
const { paymentLimiter } = require("../middlewares/rateLimiter");


/* =================================================
   ADMIN ROUTES
================================================= */

router.post(
  "/admin/payout/:vendorId",
  protect,
  adminOnly,
  payVendor
);

router.get(
  "/admin/payouts",
  protect,
  adminOnly,
  getAllPayouts
);


/* =================================================
   VENDOR ROUTES
================================================= */

router.get(
  "/vendor/payouts",
  protect,
  vendorOnly,
  getVendorPayouts
);


/* =================================================
   FRAUD DETECTION ROUTE
================================================= */

router.post(
  "/payment/payment-failed",
  protect,
  paymentLimiter,
  captureDevice,
  paymentFailed
);


module.exports = router;