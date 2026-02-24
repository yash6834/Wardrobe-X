const mongoose = require("mongoose");

/* ================= TIMELINE ================= */
const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

/* ================= RETURN SCHEMA ================= */
const returnSchema = new mongoose.Schema(
  {
    /* ================= ORDER & USER ================= */
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= ITEMS ================= */
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
        size: {
          type: String,
        },
      },
    ],

    /* ================= RETURN / EXCHANGE ================= */
    type: {
      type: String,
      enum: ["return", "exchange"],
      default: "return",
    },

    reason: {
      type: String,
      required: true,
    },

    comment: {
      type: String,
      trim: true,
    },

    /* ================= VENDOR SIDE ================= */
    vendorStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    vendorRemark: {
      type: String,
      trim: true,
    },

    /* ================= ADMIN SIDE ================= */
    adminStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    status: {
  type: String,
  enum: [
    "requested",

    // Vendor/Admin review
    "vendor_approved",
    "vendor_rejected",
    "admin_approved",
    "admin_rejected",

    // NORMAL RETURN FLOW
    "pickup_scheduled",
    "picked_up",
    "received",
    "refund_completed",

    // SAME DAY EXCHANGE FLOW
    "exchange_scheduled",
    "out_for_exchange",
    "exchange_completed"
  ],
  default: "requested",
},

exchangeOrderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Order"
},



    /* ================= PICKUP ================= */
    pickupScheduled: {
      type: Boolean,
      default: false,
    },

    pickupDate: {
      type: Date,
    },

    /* ================= REFUND ================= */
    refundAmount: {
      type: Number,
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: ["not_started", "initiated", "completed"],
      default: "not_started",
    },

    /* ================= HISTORY ================= */
    timeline: {
      type: [timelineSchema],
      default: [
        {
          status: "requested",
          message: "Return requested by user",
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Return", returnSchema);
