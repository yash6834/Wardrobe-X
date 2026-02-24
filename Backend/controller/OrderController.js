const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/Registration");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const COMMISSION_RATE = 0.1;

/* ================= RAZORPAY INSTANCE ================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    if (!shippingAddress || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    /* ================= CALCULATE SUBTOTAL ================= */

    let subtotal = 0;

    for (const item of items) {
      subtotal += item.price * item.qty;
    }

    /* ================= MEMBERSHIP DISCOUNT ================= */

    const user = await User.findById(req.user._id);

    const activeMembership = user?.memberships?.find(
      (m) => m.isActive && new Date(m.endDate) > new Date()
    );

    const discountPercent = activeMembership?.discountPercent || 0;

    const discountAmount = subtotal * (discountPercent / 100);

    const discountedSubtotal = subtotal - discountAmount;

    /* ================= SHIPPING ================= */

    const SHIPPING_FEE = 60;

    const shippingFee = discountedSubtotal > 0 ? SHIPPING_FEE : 0;

    /* ================= TAX ================= */

    const TAX_RATE = 0.02;

    const taxAmount = discountedSubtotal * TAX_RATE;

    /* ================= FINAL TOTAL ================= */

    const finalTotal = discountedSubtotal + shippingFee + taxAmount;

    /* ================= CREATE ORDERS ================= */

    const createdOrders = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate("vendor");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      const itemTotal = item.price * item.qty;

      const commissionAmount = itemTotal * COMMISSION_RATE;

      const order = await Order.create({
        user: req.user._id,
        vendor: product.vendor._id,

        items: [
          {
            product: product._id,
            quantity: item.qty,
            price: item.price,
            size: item.size || "",
            status: "pending",
          },
        ],

        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip: shippingAddress.postalCode,
        },

        paymentMethod,

        subtotal: itemTotal,

        discountPercent,
        discountAmount,
        shippingFee,
        taxAmount,

        totalAmount: finalTotal, // ✅ FIXED HERE

        commissionAmount,

        vendorEarning: itemTotal - commissionAmount,

        orderStatus: "pending",
        paymentStatus: "pending",
      });

      createdOrders.push(order);
    }

    /* ================= COD ================= */

    if (paymentMethod === "cod") {
      return res.status(201).json({
        success: true,
        orders: createdOrders,
        billing: {
          subtotal,
          discountPercent,
          discountAmount,
          shippingFee,
          taxAmount,
          total: finalTotal,
        },
      });
    }

    /* ================= RAZORPAY ================= */

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return res.status(201).json({
      success: true,
      orders: createdOrders,
      razorpay: {
        orderId: razorpayOrder.id,
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
      },
      billing: {
        subtotal,
        discountPercent,
        discountAmount,
        shippingFee,
        taxAmount,
        total: finalTotal,
      },
    });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Order creation failed",
    });
  }
};

/* ================= VERIFY ONLINE PAYMENT ================= */
const verifyOnlinePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderIds,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await Order.updateMany(
      { _id: { $in: orderIds } },
      {
        paymentStatus: "paid",
        orderStatus: "confirmed",
      }
    );

    res.json({
      success: true,
      message: "Payment verified & orders confirmed",
    });
  } catch (err) {
    console.error("VERIFY PAYMENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

/* ================= GET ORDERS ================= */
const getOrders = async (req, res) => {
  try {
    const query =
      req.user.role === "admin" ? {} : { user: req.user._id };

    const orders = await Order.find(query)
      .populate("items.product", "name image price")
      .populate("user", "name email")
      .populate("vendor", "brandName")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => {
      const itemStatuses = order.items.map((item) => item.status);

      let status = "pending";

      if (itemStatuses.every((s) => s === "delivered")) {
        status = "delivered";
      } else if (itemStatuses.every((s) => s === "shipped")) {
        status = "shipped";
      } else if (itemStatuses.some((s) => s === "cancelled")) {
        status = "cancelled";
      }

      return {
        ...order.toObject(),
        orderStatus: status,
      };
    });

    res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* ================= UPDATE STATUS (ADMIN) ================= */
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  order.orderStatus = req.body.status;
  await order.save();
  res.json({ success: true });
};

/* ================= CANCEL ORDER (USER) ================= */
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (["shipped", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    order.orderStatus = "cancelled";
    order.cancelReason = reason;
    order.items.forEach((item) => (item.status = "cancelled"));

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (err) {
    console.error("CANCEL ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

/* ================= VENDOR MARK DELIVERED ================= */
const vendorMarkDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this order",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Order already delivered",
      });
    }

    order.items.forEach((item) => {
      item.status = "delivered";
    });

    order.orderStatus = "delivered";

    if (order.paymentMethod !== "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();

    res.json({
      success: true,
      message: "Order marked as delivered",
    });
  } catch (err) {
    console.error("VENDOR DELIVER ERROR:", err);
    res.status(500).json({
      message: "Failed to mark order delivered",
    });
  }
};

/* ================= GET ORDER BY ID ================= */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Ensure order belongs to logged-in user
    if (
      order.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports = {
  createOrder,
  verifyOnlinePayment,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  vendorMarkDelivered,
  getOrderById
};
