const express = require("express");
const router = express.Router();

const {
  getTotalUsers,
  getTotalOrders,
  getTotalProducts,
  getDashboardStats,
  getMonthlySales,
  getOrdersByDate,
} = require("../controller/AdminDashboardController");

// Individual count routes
router.get("/users-count", getTotalUsers);
router.get("/orders-count", getTotalOrders);
router.get("/products-count", getTotalProducts);

// Chart data routes
router.get("/monthly-sales", getMonthlySales);
router.get("/orders-by-date", getOrdersByDate);

// Combined stats route
router.get("/stats", getDashboardStats);

module.exports = router;
