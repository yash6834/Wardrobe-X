const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} = require("../controller/productController");
const upload = require("../middlewares/uploads");

// ✅ Create a new product (with image upload)
router.post("/", upload.single("image"), createProduct);

// ✅ Get all products
router.get("/", getProducts);

// ✅ Get product by ID
router.get("/:id", getProductById);

// ✅ Update product (with optional new image)
router.put("/:id", upload.single("image"), updateProduct);

module.exports = router;
