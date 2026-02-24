const Product = require("../models/Product");
const Order = require("../models/Order");
const regisSchema = require("../models/Registration")

/* =========================
   GET VENDOR PROFILE
========================= */
const getVendorProfile = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({
      id: req.user._id,
      name: req.user.name,
      brandName: req.user.brandName,
      email: req.user.email,
      phone: req.user.phone,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET VENDOR PRODUCTS
========================= */
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/* =========================
   GET SINGLE VENDOR PRODUCT
========================= */
const getVendorProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


/* =========================
   CREATE VENDOR PRODUCT
========================= */
const createVendorProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sizes = JSON.parse(req.body.sizes);

    const product = new Product({
      name: req.body.name,
      price: Number(req.body.price),
      category: req.body.category,
      subCategory: req.body.subCategory,
      description: req.body.description,
      sizes,
      image: req.files?.map((f) => `/uploads/${f.filename}`) || [], // ✅ SAFE
      vendor: req.user._id,
      isApproved: false,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};



/* =========================
   UPDATE VENDOR PRODUCT
========================= */
const updateVendorProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Update basic fields safely
    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.subCategory = req.body.subCategory ?? product.subCategory;
    product.description = req.body.description ?? product.description;

    // ✅ Sizes come as JSON string
    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    // ✅ Images only if new uploaded
    if (req.files && req.files.length > 0) {
      product.image = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    // 🔒 Re-approval required
    product.isApproved = false;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(400).json({ message: "Failed to update product" });
  }
};

/* =========================
   DELETE VENDOR PRODUCT
========================= */
const deleteVendorProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/* =========================
   GET VENDOR ORDERS
========================= */
const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    // 🔥 Fetch only orders belonging to this vendor
    const orders = await Order.find({ vendor: vendorId })
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET VENDOR ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor orders",
    });
  }
};



/* =========================
   GET ALL VENDORS (ADMIN)
========================= */
const getAllVendors = async (req, res) => {
  try {
    // Debug (keep for now)
    console.log("ADMIN USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const vendors = await regisSchema
      .find({ role: "seller" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(vendors);
  } catch (error) {
    console.error("GET ALL VENDORS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};



/* =========================
   UPDATE ORDER ITEM STATUS
========================= */
/* =========================
   UPDATE ORDER ITEM STATUS
========================= */
const updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔒 Vendor can update only own orders
    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    /* ========== UPDATE ITEM STATUS ========== */
    item.status = status;

    /* ========== RECALCULATE ORDER STATUS ========== */
    const statuses = order.items.map((i) => i.status);

    if (statuses.every((s) => s === "cancelled")) {
      order.orderStatus = "cancelled";
    } 
    else if (statuses.every((s) => s === "delivered")) {
      order.orderStatus = "delivered";
    } 
    else if (statuses.some((s) => s === "shipped")) {
      order.orderStatus = "shipped";
    } 
    else if (statuses.some((s) => s === "confirmed")) {
      order.orderStatus = "confirmed";
    } 
    else {
      order.orderStatus = "pending";
    }

    /* ========== COD PAYMENT AUTO UPDATE ========== */
    if (
      order.paymentMethod === "cod" &&
      order.orderStatus === "delivered"
    ) {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.json({
      success: true,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
    });
  } catch (err) {
    console.error("UPDATE ITEM STATUS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getVendorDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user._id;

    /* ================= PRODUCTS ================= */
    const totalProducts = await Product.countDocuments({
      vendor: vendorId,
    });

    const pendingProducts = await Product.countDocuments({
      vendor: vendorId,
      isApproved: false,
    });

    /* ================= ORDERS ================= */
    const orders = await Order.find({ vendor: vendorId });

    const totalOrders = orders.length;

    let paidRevenue = 0;
    let unpaidRevenue = 0;

    const orderStatusCount = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      // status count
      orderStatusCount[order.orderStatus] =
        (orderStatusCount[order.orderStatus] || 0) + 1;

      // revenue split
      if (order.orderStatus === "delivered") {
        if (order.settlementStatus === "paid") {
          paidRevenue += order.vendorEarning;
        } else {
          unpaidRevenue += order.vendorEarning;
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalProducts,
        pendingProducts,
        totalOrders,
        revenue: {
          paid: paidRevenue,
          unpaid: unpaidRevenue,
        },
        ordersByStatus: orderStatusCount,
      },
    });
  } catch (error) {
    console.error("VENDOR DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    });
  }
};

module.exports = {
  getVendorProfile,
  getVendorProducts,
  getVendorProductById,
  createVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  getAllVendors,
  updateOrderItemStatus,
  getVendorDashboardStats
};
