const mongoose = require("mongoose");

const fraudLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    userName: {
    type: String,
    default: "Guest",
  },

    ipAddress: {
      type: String,
      required: true,
    },

    device: {
      type: String,
      default: "unknown",
    },

    action: {
      type: String,
      enum: [
        "payment_attempt",
        "payment_success",
        "payment_failed",
        "order_created",
        "login_failed",
        "login_success"
      ],
      required: true,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    notes: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FraudLog", fraudLogSchema);