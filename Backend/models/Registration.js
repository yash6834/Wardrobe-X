const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const regisSchema = new mongoose.Schema(
  {
    // 👤 Common fields
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin", "seller"], // seller = vendor
      default: "user",
    },

    // 🏪 Seller / Vendor fields
    brandName: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "seller";
      },
    },

    shopAddress: {
      type: String,
    },

    gstNumber: {
      type: String,
      default: null,
    },

    // ✅ Admin approval
    isApproved: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // 💰 Commission & wallet
    commissionRate: {
      type: Number,
      default: 10, // %
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    // 🎫 Memberships (array)
    memberships: [
      {
        membershipPlan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Membership",
          required: true,
        },

        // 🔒 Snapshot (safe from future edits)
        planName: {
          type: String,
          required: true,
        },

        pricePaid: {
          type: Number,
          required: true,
        },

        durationInDays: {
          type: Number,
          required: true,
        },

        discountPercent: {
          type: Number,
          default: 0,
        },

        startDate: {
          type: Date,
          default: Date.now,
        },

        endDate: {
          type: Date,
          required: true,
        },

        isActive: {
          type: Boolean,
          default: true,
        },

        paymentId: {
          type: String, // Razorpay payment id
        },
      },
    ],
  },
  { timestamps: true }
);

//
// 🔐 Hash password before save
//
regisSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//
// 🔑 Compare password
//
regisSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

//
// ⚡ Index for faster membership checks
//
regisSchema.index({ "memberships.isActive": 1 });

//
// 📦 Model export
//
const regisModel = mongoose.model("User", regisSchema, "Register");
module.exports = regisModel;
