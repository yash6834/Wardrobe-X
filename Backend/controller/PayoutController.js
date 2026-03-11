const Order = require("../models/Order");
const Payout = require("../models/Payout");
const FraudLog = require("../models/FroudLog");

exports.calculateRiskScore = async (userId) => {

  const failedPayments = await FraudLog.countDocuments({
    userId,
    action: "payment_failed",
    createdAt: {
      $gte: new Date(Date.now() - 60 * 60 * 1000)
    }
  });

  let score = 0;

  if (failedPayments >= 3) score = 50;
  if (failedPayments >= 5) score = 80;

  return score;
};

/* ADMIN → PAY VENDOR */
exports.payVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const orders = await Order.find({
      vendor: vendorId,
      orderStatus: "delivered",
      settlementStatus: "pending",
      paymentStatus: { $in: ["paid", "pending"] },
    });

    if (!orders.length) {
      return res.status(400).json({
        success: false,
        message: "No delivered & unpaid orders found for this vendor",
      });
    }

    const totalAmount = orders.reduce(
      (sum, order) => sum + (order.vendorEarning || 0),
      0
    );

    const payout = await Payout.create({
      vendor: vendorId,
      amount: totalAmount,
      orders: orders.map((o) => o._id),
      status: "paid",
      paidAt: new Date(),
    });

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
      ordersPaid: orders.length,
      totalAmount,
    });

  } catch (error) {
    console.error("Pay vendor error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process payout",
    });
  }
};

/* VENDOR → PAYOUT HISTORY */
exports.getVendorPayouts = async (req, res) => {
  try {

    const payouts = await Payout.find({
      vendor: req.user._id,
    })
      .populate("orders", "_id totalAmount vendorEarning")
      .sort({ createdAt: -1 });

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

/* ADMIN → ALL PAYOUTS */
exports.getAllPayouts = async (req, res) => {
  try {

    const payouts = await Payout.find()
      .populate("vendor", "name email brandName")
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

/* PAYMENT FAILED LOG */
exports.paymentFailed = async (req, res) => {
  try {

    const userId = req.user?._id || null;
    console.log(userId)
    const ipAddress = req.clientIp || req.ip || "unknown";

    // 1️⃣ Save fraud log first
    const log = await FraudLog.create({
      userId,
      userName: req.user?.name || "Guest",
      ipAddress,
      device: req.device || "unknown",
      action: "payment_failed",
      riskScore: 0
    });

    // 2️⃣ Calculate risk score AFTER saving
    let riskScore = 0;

    if (userId) {
      riskScore = await exports.calculateRiskScore(userId);
    }

    // 3️⃣ Update same log with risk score
    await FraudLog.findByIdAndUpdate(log._id, {
      riskScore
    });

    console.log("Fraud log saved with score:", riskScore);

    res.json({
      message: "Payment failure logged",
      riskScore
    });

  } catch (err) {
    console.error("Fraud log error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* PAYMENT SUCCESS LOG */
exports.paymentSuccess = async (req, res) => {
  try {

    await FraudLog.create({
      userId: req.user?._id || null,
      ipAddress: req.clientIp,
      device: req.device,
      action: "payment_success",
    });

    res.json({
      success: true,
      message: "Payment success logged",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

