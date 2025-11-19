const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} = require("../controller/CartController");
const { protect } = require("../middlewares/authMiddleware"); // JWT auth middleware

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.delete("/remove", protect, removeFromCart);

module.exports = router;
