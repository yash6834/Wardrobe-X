const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // 🔐 Vendor ownership (seller)
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 fast vendor-wise queries
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // 👕 Size-wise stock
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🖼 Multiple images (URL / path)
    image: [
      {
        type: String,
        required: true,
      },
    ],

    // 🛑 Admin approval
   isApproved: {
  type: Boolean,
  default: false,
  index: true,
},


    // 💰 Commission per product
    commissionPercent: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },

    // 🟢 Product active / inactive
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 Helpful compound index (vendor + approval)
productSchema.index({ vendor: 1, isApproved: 1 });

module.exports = mongoose.model("Product", productSchema);
