const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    /* ================= VENDOR ================= */
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    /* ================= PAYOUT AMOUNT ================= */
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    /* ================= RELATED ORDERS ================= */
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    /* ================= PAYOUT STATUS ================= */
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "paid",
      index: true,
    },

    /* ================= WHO PROCESSED ================= */
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin
    },

    /* ================= OPTIONAL NOTES ================= */
    notes: {
      type: String,
    },

    /* ================= PAYMENT DATE ================= */
    paidAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    /* ================= REFERENCE ================= */
    referenceId: {
      type: String, // bank / UPI reference
    },
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// Faster vendor payout queries
payoutSchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model("Payout", payoutSchema);