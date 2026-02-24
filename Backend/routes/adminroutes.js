const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const {
  getPendingProducts,
  approveProduct,
  getAllProducts, // ✅ ADD THIS
} = require("../controller/AdminController");

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

module.exports = router;
