const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* ================== RELATIONS ================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================== ITEMS ================== */
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        size: String,
        status: {
          type: String,
          enum: [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
          ],
          default: "pending",
          index: true,
        },
      },
    ],

    /* ================== SHIPPING ================== */
    shippingAddress: {
      address: { type: String, required: true },
      city: String,
      state: String,
      zip: String,
    },

    /* ================== PAYMENT ================== */
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    /* ================== MONEY ================== */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    commissionRate: {
      type: Number,
      default: 10,
    },

    commissionAmount: {
      type: Number,
      required: true,
    },

    vendorEarning: {
      type: Number,
      required: true,
    },

    /* ================== SETTLEMENT ================== */
    settlementStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      index: true,
    },

    settledAt: Date,

    /* ================== ORDER STATUS ================== */
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    cancelReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
