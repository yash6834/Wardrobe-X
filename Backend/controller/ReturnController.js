const Return = require("../models/Return");
const Order = require("../models/Order");
const Notification = require("../models/Notification");



/* ================= CREATE RETURN ================= */
exports.createReturn = async (req, res) => {
  try {
    const { orderId, items, type, reason, comment, newSize } = req.body;

    if (!orderId || !items?.length || !reason) {
      return res
        .status(400)
        .json({ message: "Required fields missing" });
    }

    const order = await Order.findById(orderId).populate(
      "items.product"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    /* ================= ITEM VALIDATION ================= */
    const validItems = [];

    for (let reqItem of items) {
      const orderItem = order.items.find(
        (i) =>
          i.product._id.toString() === reqItem.product.toString()
      );

      if (!orderItem) {
        return res
          .status(400)
          .json({ message: "Invalid product in return" });
      }

      // ❌ Only delivered items can be returned
      if (orderItem.status !== "delivered") {
        return res.status(400).json({
          message:
            "Return allowed only for delivered items",
        });
      }

      validItems.push({
        product: orderItem.product._id,
        quantity: orderItem.quantity,
        size: orderItem.size,
      });
    }

    /* ================= DUPLICATE CHECK (ITEM-WISE) ================= */
    const existingReturn = await Return.findOne({
      orderId,
      "items.product": { $in: validItems.map(i => i.product) }
    });

    if (existingReturn) {
      return res.status(400).json({
        message: "Return already requested for this item",
      });
    }

    /* ================= CREATE RMA ================= */
    const rma = await Return.create({
      orderId,
      userId: req.user._id,
      items: validItems,
      type: type || "return",
      reason,
      comment,
      newSize: type === "exchange" ? newSize : null,
      status: "requested",
      timeline: [
        {
          status: "requested",
          message: "Return requested by user",
          date: new Date(),
        },
      ],
    });

    res.status(201).json(rma);
  } catch (error) {
    console.error("Create Return Error:", error);
    res
      .status(500)
      .json({ message: "Failed to create return" });
  }
};

/* ================= USER RETURNS ================= */
exports.getUserReturns = async (req, res) => {
  try {
    const returns = await Return.find({ userId: req.user._id })
      .populate("orderId")
      .populate({
        path: "items.product",
        select: "name image price vendor"
      })
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    console.error("Get User Returns Error:", error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};


/* ================= ADMIN RETURNS ================= */
exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate("userId", "name email")
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json(returns);
  } catch (error) {
    console.error("Get All Returns Error:", error);
    res.status(500).json({ message: "Failed to fetch returns" });
  }
};

/* ================= UPDATE STATUS (ADMIN) ================= */
exports.updateReturnStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const rma = await Return.findById(req.params.id);
    if (!rma) {
      return res.status(404).json({ message: "Return not found" });
    }

    rma.status = status;
    rma.timeline.push({
      status,
      message: message || `Status updated to ${status}`
    });

    await rma.save();
    res.json(rma);
  } catch (error) {
    console.error("Update Return Status Error:", error);
    res.status(500).json({ message: "Failed to update return status" });
  }
};

/* ================= SCHEDULE PICKUP ================= */
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

    rma.pickupDate = pickupDate;
    rma.pickupScheduled = true;
    rma.status = "pickup_scheduled";
    rma.timeline.push({
      status: "pickup_scheduled",
      message: "Pickup scheduled"
    });

    await rma.save();
    res.json(rma);
  } catch (error) {
    console.error("Schedule Pickup Error:", error);
    res.status(500).json({ message: "Failed to schedule pickup" });
  }
};

/* ================= INITIATE REFUND ================= */
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
    rma.refundStatus = "completed";
    rma.status = "refund_completed";

    rma.timeline.push({
      status: "refund_completed",
      message: `Refund of ₹${refundAmount} completed`,
    });

    await rma.save();

    // 🔔 CREATE CUSTOMER NOTIFICATION
    await Notification.create({
      user: rma.userId,
      title: "Refund Processed",
      message: `₹${refundAmount} has been refunded to your original payment method.`,
      type: "refund",
    });

    res.json(rma);
  } catch (error) {
    console.error("Initiate Refund Error:", error);
    res.status(500).json({ message: "Failed to initiate refund" });
  }
};


/* ========== VENDOR REVIEW RETURN ========== */
exports.vendorReviewReturn = async (req, res) => {
  const { action, remark } = req.body;

  const rma = await Return.findById(req.params.id)
    .populate({
      path: "items.product",
      select: "vendor",
    });

  if (!rma) {
    return res.status(404).json({ message: "Return not found" });
  }

  const vendorOwnsProduct = rma.items.some(
    (i) =>
      i.product.vendor.toString() === req.user._id.toString()
  );

  if (!vendorOwnsProduct) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  rma.vendorStatus = action;

  if (action === "approved") {
    rma.status = "vendor_approved";
  } else {
    rma.status = "vendor_rejected";
  }

  rma.vendorRemark = remark;

  rma.timeline.push({
    status: rma.status,
    message: remark || `Vendor ${action} the return`,
  });

  await rma.save();
  res.json(rma);
};

