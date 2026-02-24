const express = require("express");
const router = express.Router();

const {
  payVendor,
  getVendorPayouts,
  getAllPayouts,
} = require("../controller/PayoutController");

const {
  protect,
  adminOnly,
  vendorOnly,
} = require("../middlewares/authMiddleware");

/* ===============================
   ADMIN
================================ */
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

/* ===============================
   VENDOR
================================ */
router.get(
  "/vendor/payouts",
  protect,
  vendorOnly,
  getVendorPayouts
);

module.exports = router;
