const Return = require("../models/Return");

const Product = require("../models/Product");
const Order = require("../models/Order");

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, category, subCategory, price, stock, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !category || !subCategory || !price || !stock) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newProduct = new Product({ name, category, subCategory, price, stock, description, image });
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting product ID:", id); // Debug

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   GET PENDING PRODUCTS
========================= */
exports.getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
      .populate("vendor", "name brandName email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("PENDING PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pending products" });
  }
};

/* =========================
   APPROVE / REJECT PRODUCT
========================= */
exports.approveProduct = async (req, res) => {
  try {
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
    console.error("APPROVE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Failed to update product status" });
  }
};

// controller/AdminController.js
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name email brandName")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET ALL RETURNS (ADMIN) ================= */
exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("userId", "name email")
      .populate("orderId")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    console.error("Get All Returns Error:", error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

/* ================= ADMIN FINAL DECISION ================= */

exports.adminDecision = async (req, res) => {
  try {
    const { action } = req.body; // approved / rejected

    const rma = await Return.findById(req.params.id)
      .populate("orderId");

    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    if (action === "rejected") {
      rma.adminStatus = "rejected";
      rma.status = "admin_rejected";

      rma.timeline.push({
        status: "admin_rejected",
        message: "Admin rejected the request"
      });

      await rma.save();
      return res.json(rma);
    }

    /* ================= APPROVED ================= */

    rma.adminStatus = "approved";

    if (rma.type === "exchange") {

      // 🔥 SAME DAY EXCHANGE FLOW

      // Create replacement order
      const replacementOrder = await Order.create({
        user: rma.userId,
        vendor: rma.orderId.vendor,
        items: rma.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: 0, // exchange no extra payment
          size: item.size,
          status: "confirmed"
        })),
        shippingAddress: rma.orderId.shippingAddress,
        paymentMethod: rma.orderId.paymentMethod,
        paymentStatus: "paid",
        totalAmount: 0,
        commissionAmount: 0,
        vendorEarning: 0,
        orderStatus: "confirmed"
      });

      rma.exchangeOrderId = replacementOrder._id;

      rma.status = "exchange_scheduled";

      rma.timeline.push({
        status: "exchange_scheduled",
        message: "Exchange scheduled for doorstep swap"
      });

    } else {
      // 🔥 NORMAL RETURN FLOW
      rma.status = "pickup_scheduled";

      rma.timeline.push({
        status: "pickup_scheduled",
        message: "Pickup scheduled for return"
      });
    }

    await rma.save();
    res.json(rma);

  } catch (error) {
    console.error("Admin Decision Error:", error);
    res.status(500).json({ message: "Failed to process decision" });
  }
};

exports.markOutForExchange = async (req, res) => {
  const rma = await Return.findById(req.params.id);

  if (!rma) {
    return res.status(404).json({ message: "Return not found" });
  }

  rma.status = "out_for_exchange";

  rma.timeline.push({
    status: "out_for_exchange",
    message: "Delivery partner is on the way"
  });

  await rma.save();
  res.json(rma);
};

exports.completeExchange = async (req, res) => {
  const rma = await Return.findById(req.params.id)
    .populate("exchangeOrderId");

  if (!rma) {
    return res.status(404).json({ message: "Return not found" });
  }

  rma.status = "exchange_completed";

  rma.timeline.push({
    status: "exchange_completed",
    message: "Old product picked up and replacement delivered"
  });

  if (rma.exchangeOrderId) {
    rma.exchangeOrderId.orderStatus = "delivered";
    await rma.exchangeOrderId.save();
  }

  await rma.save();
  res.json(rma);
};


/* ================= SCHEDULE PICKUP (ADMIN) ================= */
exports.schedulePickup = async (req, res) => {
  try {
    const { pickupDate } = req.body;

    if (!pickupDate) {
      return res.status(400).json({ message: "Pickup date required" });
    }

    const rma = await Return.findById(req.params.id);
    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    rma.pickupScheduled = true;
    rma.pickupDate = pickupDate;
    rma.status = "pickup_scheduled";

    rma.timeline.push({
      status: "pickup_scheduled",
      message: "Pickup scheduled by admin",
    });

    await rma.save();
    res.json(rma);
  } catch (error) {
    console.error("Schedule Pickup Error:", error);
    res.status(500).json({ message: "Failed to schedule pickup" });
  }
};

/* ================= INITIATE REFUND (ADMIN) ================= */
exports.initiateRefund = async (req, res) => {
  try {
    const { refundAmount } = req.body;

    if (!refundAmount || refundAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Valid refund amount required" });
    }

    const rma = await Return.findById(req.params.id);
    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    rma.refundAmount = refundAmount;
    rma.refundStatus = "initiated";
    rma.status = "refund_initiated";

    rma.timeline.push({
      status: "refund_initiated",
      message: `Refund of ₹${refundAmount} initiated`,
    });

    await rma.save();
    res.json(rma);
  } catch (error) {
    console.error("Initiate Refund Error:", error);
    res.status(500).json({ message: "Failed to initiate refund" });
  }
};

/* ================= MARK COMPLETED (ADMIN) ================= */
exports.markReturnCompleted = async (req, res) => {
  try {
    const rma = await Return.findById(req.params.id);
    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    rma.status = "completed";
    rma.refundStatus =
      rma.refundStatus === "initiated"
        ? "completed"
        : rma.refundStatus;

    rma.timeline.push({
      status: "completed",
      message: "Return process completed",
    });

    await rma.save();
    res.json(rma);
  } catch (error) {
    console.error("Complete Return Error:", error);
    res.status(500).json({ message: "Failed to complete return" });
  }
};

exports.markPickedUp = async (req, res) => {
  const rma = await Return.findById(req.params.id);
  if (!rma) {
    return res.status(404).json({ message: "Return not found" });
  }

  rma.status = "picked_up";
  rma.timeline.push({
    status: "picked_up",
    message: "Item picked up from customer",
  });

  await rma.save();
  res.json(rma);
};

exports.markReceived = async (req, res) => {
  const rma = await Return.findById(req.params.id);
  if (!rma) {
    return res.status(404).json({ message: "Return not found" });
  }

  rma.status = "received";
  rma.timeline.push({
    status: "received",
    message: "Item received & verified",
  });

  await rma.save();
  res.json(rma);
};

