const express = require("express");
const router = express.Router();

const { getFraudLogs } = require("../controller/Froud");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.get(
  "/admin/fraud-logs",
  protect,
  adminOnly,
  getFraudLogs
);

module.exports = router;