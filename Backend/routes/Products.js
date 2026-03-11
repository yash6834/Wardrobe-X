const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
} = require("../controller/productController");

const upload = require("../middlewares/uploads");


/* ===============================
   CREATE PRODUCT (MULTIPLE IMAGES)
   =============================== */
router.post(
  "/",
  upload.array("image", 10), // ✅ allow up to 10 images
  createProduct
);


/* ===============================
   GET ALL PRODUCTS
   =============================== */
router.get("/", getProducts);


/* ===============================
   GET PRODUCT BY ID
   =============================== */
router.get("/:id", getProductById);


/* ===============================
   UPDATE PRODUCT (MULTIPLE IMAGES)
   =============================== */
router.put(
  "/:id",
  upload.array("image", 10), // ✅ allow multiple images update
  updateProduct
);


module.exports = router;