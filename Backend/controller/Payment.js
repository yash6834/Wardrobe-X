const Razorpay = require("razorpay");
const FraudLog = require("../models/FroudLog");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    /* ================= VALIDATION ================= */

    if (!amount || isNaN(amount)) {

      /* ===== FRAUD LOG : INVALID PAYMENT ATTEMPT ===== */

      try {
        await FraudLog.create({
          userId: req.user?._id || null,
          ipAddress: req.clientIp,
          device: req.device,
          action: "payment_failed",
        });
      } catch (logErr) {
        console.error("FraudLog Error:", logErr.message);
      }

      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    /* ================= CONVERT TO PAISA ================= */

    amount = Math.round(Number(amount) * 100);

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    /* ================= CREATE RAZORPAY ORDER ================= */

    const order = await razorpay.orders.create(options);

    /* ===== FRAUD LOG : PAYMENT ATTEMPT CREATED ===== */

    try {
      await FraudLog.create({
        userId: req.user?._id || null,
        ipAddress: req.clientIp,
        device: req.device,
        action: "payment_attempt",
      });
    } catch (logErr) {
      console.error("FraudLog Error:", logErr.message);
    }

    res.json(order);

  } catch (error) {

    console.error("RAZORPAY ERROR:", error);

    /* ===== FRAUD LOG : PAYMENT FAILURE ===== */

    try {
      await FraudLog.create({
        userId: req.user?._id || null,
        ipAddress: req.clientIp,
        device: req.device,
        action: "payment_failed",
      });
    } catch (logErr) {
      console.error("FraudLog Error:", logErr.message);
    }

    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};