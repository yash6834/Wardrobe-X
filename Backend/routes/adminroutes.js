const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const {
  getPendingProducts,
  approveProduct,
  getAllProducts,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword, // ✅ ADD THIS
} = require("../controller/AdminController");
const { getRecentOrders } = require("../controller/OrderController");

/* ================= PRODUCTS ================= */

// 🔹 Get ALL products (pending + approved + rejected)
router.get(
  "/products/all",
  protect,
  adminOnly,
  getAllProducts
);

// 🔹 Get ONLY pending products
router.get(
  "/products/pending",
  protect,
  adminOnly,
  getPendingProducts
);

// 🔹 Approve / Reject product
router.put(
  "/products/:id/approve",
  protect,
  adminOnly,
  approveProduct

);
router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile", protect, adminOnly, updateAdminProfile);
router.put("/change-password", protect, adminOnly, changeAdminPassword);

// 👉 Recent Orders API
router.get("/orders/recent", getRecentOrders);
module.exports = router;
