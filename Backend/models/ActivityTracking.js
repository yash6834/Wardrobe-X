const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  ipAddress: String,

  device: String,

  action: {
    type: String,
    enum: [
      "payment_failed",
      "payment_success",
      "order_created",
      "login_failed",
      "login_success"
    ]
  },

  riskScore: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FraudLog", fraudLogSchema);