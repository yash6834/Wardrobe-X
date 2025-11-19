const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { createProduct, getProducts, deleteProduct } = require("../controller/AdminController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
router.post("/products", upload.single("image"), createProduct);
router.get("/products", getProducts);
router.delete("/products/:id", deleteProduct); // <-- simple route


module.exports = router;
