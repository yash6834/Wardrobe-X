const Order = require("../models/Order");
const Payout = require("../models/Payout");

/* ===============================
   ADMIN → PAY VENDOR
================================ */
exports.payVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // 1️⃣ Find payable orders
    const orders = await Order.find({
      vendor: vendorId,
      orderStatus: "delivered",
      settlementStatus: "pending",
      paymentStatus: { $in: ["paid", "pending"] }, // COD allowed
    });

    if (!orders.length) {
      return res.status(400).json({
        success: false,
        message: "No delivered & unpaid orders found for this vendor",
      });
    }

    // 2️⃣ Calculate payout
    const totalAmount = orders.reduce(
      (sum, o) => sum + o.vendorEarning,
      0
    );

    // 3️⃣ Create payout record
    const payout = await Payout.create({
      vendor: vendorId,
      amount: totalAmount,
      orders: orders.map((o) => o._id),
      status: "paid",
      paidAt: new Date(),
    });

    // 4️⃣ Mark orders as settled
    await Order.updateMany(
      { _id: { $in: payout.orders } },
      {
        settlementStatus: "paid",
        settledAt: new Date(),
      }
    );

    res.status(201).json({
      success: true,
      message: "Vendor payout completed successfully",
      payout,
    });
  } catch (error) {
    console.error("Pay vendor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process payout",
    });
  }
};

/* ===============================
   VENDOR → PAYOUT HISTORY
================================ */
exports.getVendorPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find({
      vendor: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("orders", "_id totalAmount vendorEarning");

    res.json({
      success: true,
      payouts,
    });
  } catch (error) {
    console.error("Vendor payouts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
    });
  }
};

/* ===============================
   ADMIN → ALL PAYOUTS
================================ */
exports.getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payouts,
    });
  } catch (error) {
    console.error("Admin payouts error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payouts",
    });
  }
};
