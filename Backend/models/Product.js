const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // 🔐 Vendor ownership
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔥 faster search
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      required: true,
      index: true,
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
      index: true, // useful for price filters
    },

    // 🖼 Multiple images
    image: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one image is required",
      },
    },

    // ⭐ OPTIONAL BUT RECOMMENDED (thumbnail)
    thumbnail: {
      type: String,
      default: "",
    },

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

    // 🟢 Active / inactive
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

  },
  {
    timestamps: true,
  }
);

// 🔥 Compound index
productSchema.index({ vendor: 1, isApproved: 1 });

// 🔥 Set thumbnail automatically
productSchema.pre("save", function (next) {
  if (this.image.length > 0 && !this.thumbnail) {
    this.thumbnail = this.image[0];
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);