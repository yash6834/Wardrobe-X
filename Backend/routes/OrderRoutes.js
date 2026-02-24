const express = require("express");
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  vendorMarkDelivered,
  verifyOnlinePayment,
  getOrderById,
} = require("../controller/OrderController");

const { protect, adminOnly, vendorOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:orderId", protect, getOrderById);

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.put("/update/:orderId", protect, adminOnly, updateOrderStatus);
router.put("/cancel/:orderId", protect, cancelOrder);
router.post("/verify-payment", protect, verifyOnlinePayment);

router.put(
  "/vendor/orders/:orderId/deliver",
  protect,
  vendorOnly,
  vendorMarkDelivered
);

module.exports = router;
