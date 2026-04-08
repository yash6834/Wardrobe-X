const express = require("express");
const router = express.Router();
const protect = require("../middlewares/vendormiddleware");
const multer = require("multer");

const {
  getVendorProfile,
  getVendorProducts,
  getVendorProductById,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  updateOrderItemStatus,
  getAllVendors,
  getVendorDashboardStats,
 

} = require("../controller/VendorController");

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= PROFILE ================= */
router.get("/profile", protect, getVendorProfile);

/* ================= PRODUCTS ================= */
router.get("/products", protect, getVendorProducts);
router.get("/products/:id", protect, getVendorProductById);

router.post(
  "/products",
  protect,
  upload.array("image", 5),
  createVendorProduct
);

router.put(
  "/products/:id",
  protect,
  upload.array("image", 5),
  updateVendorProduct
);

router.delete("/products/:id", protect, deleteVendorProduct);

/* ================= ORDERS ================= */
router.get("/orders", protect, getVendorOrders);
router.put("/orders/:orderId/item/:itemId", protect, updateOrderItemStatus);

/* ================= ADMIN ================= */

// 🔹 Get all vendors
router.get("/admin/vendors", protect, getAllVendors);



/* ================= DASHBOARD ================= */
router.get("/dashboard", protect, getVendorDashboardStats);

module.exports = router;