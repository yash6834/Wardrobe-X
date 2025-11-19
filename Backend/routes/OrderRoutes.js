const express = require("express");
const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controller/OrderController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Create order (any logged-in user)
router.post("/", protect, createOrder);

// ✅ Get orders (user sees own orders, admin sees all)
router.get("/", protect, getOrders);

// ✅ Update order status (admins only)
router.put("/update/:orderId", protect, adminOnly, updateOrderStatus);



module.exports = router;
