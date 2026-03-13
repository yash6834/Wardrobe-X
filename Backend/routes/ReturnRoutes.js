const express = require("express");
const router = express.Router();

const {
  createReturn,
  getUserReturns,
  scheduleExchange,
} = require("../controller/ReturnController");

const {
  getVendorReturns,
  vendorReviewReturn,
} = require("../controller/VendorReturnController");

const {
  getAllReturns,
  adminDecision,
  schedulePickup,
  initiateRefund,
  markReturnCompleted,
  markOutForExchange,
  completeExchange,
} = require("../controller/AdminController");

const {
  protect,
  adminOnly,
  vendorOnly,
} = require("../middlewares/authMiddleware");


const {
  markPickedUp,
  markReceived,
} = require("../controller/AdminController");

/* ================= USER ROUTES ================= */

// Create return / exchange
router.post("/", protect, createReturn);

// Logged-in user's returns
router.get("/my", protect, getUserReturns);


/* ================= VENDOR ROUTES ================= */

// Vendor sees only their product returns
router.get("/vendor", protect, vendorOnly, getVendorReturns);

// Vendor approves / rejects return
router.put("/vendor/:id", protect, vendorOnly, vendorReviewReturn);


/* ================= ADMIN ROUTES ================= */

// Admin sees all returns
router.get("/admin", protect, adminOnly, getAllReturns);

// Admin final approve / reject
router.put("/admin/:id", protect, adminOnly, adminDecision);

router.put(
  "/admin/:id/out-for-exchange",
  protect,
  adminOnly,
  markOutForExchange
);

router.put(
  "/admin/:id/exchange-complete",
  protect,
  adminOnly,
  completeExchange
);


// Admin schedules pickup
router.put("/admin/:id/pickup", protect, adminOnly, schedulePickup);

// Admin initiates refund
router.put("/admin/:id/refund", protect, adminOnly, initiateRefund);

// Admin marks return completed
router.put("/admin/:id/complete", protect, adminOnly, markReturnCompleted);

router.put(
  "/admin/:id/picked-up",
  protect,
  adminOnly,
  markPickedUp
);

router.put(
  "/admin/:id/received",
  protect,
  adminOnly,
  markReceived
);

router.put(
  "/admin/:id/exchange-schedule",
  protect,
  adminOnly,
  scheduleExchange
);


module.exports = router;
