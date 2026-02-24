const Product = require("../models/Product");

/* =========================
   GET PENDING PRODUCTS
========================= */
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
      .populate("vendor", "name email");

    res.status(200).json(products);
  } catch (error) {
    console.error("PENDING PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   APPROVE / REJECT PRODUCT
========================= */
exports.approveProduct = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isApproved = req.body.isApproved; // true / false
    await product.save();

    res.json({
      message: product.isApproved
        ? "Product approved"
        : "Product rejected",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product status" });
  }
};
