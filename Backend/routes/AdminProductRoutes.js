const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  createProduct,
  getProducts,
  deleteProduct,
  getPendingProducts,
  approveProduct,
} = require("../controller/AdminController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* =========================
   PRODUCT ROUTES
========================= */
router.post("/products", upload.single("image"), createProduct);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct);

/* =========================
   ADMIN APPROVAL ROUTES
========================= */
router.get(
  "/products/pending",
  protect,
  adminOnly,
  getPendingProducts
);

router.put(
  "/products/:id/approve",
  protect,
  adminOnly,
  approveProduct
);

module.exports = router;
