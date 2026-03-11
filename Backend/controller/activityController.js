const Product = require("../models/Product");
const UserActivity = require("../models/UserActivity");
const mongoose = require("mongoose");
const Order = require("../models/Order");


/* ================= TRACK ACTIVITY ================= */

exports.trackActivity = async (req, res) => {

  try {

    const { productId, action } = req.body;

    if (!productId || !action) {
      return res.status(400).json({
        success: false,
        message: "productId and action required"
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    await UserActivity.create({
      userId: req.user._id,
      productId,
      action
    });

    res.json({ success: true });

  } catch (err) {

    console.error("Track activity error:", err);

    res.status(500).json({
      success: false,
      message: "Activity tracking failed"
    });

  }

};



/* ================= RECENTLY VIEWED (UNIQUE PRODUCTS) ================= */

exports.getRecentViews = async (req, res) => {

  try {

    if (!req.user) {
      return res.json({ products: [] });
    }

    const activities = await UserActivity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
          action: "view"
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$productId",
          lastViewed: { $first: "$createdAt" }
        }
      },
      {
        $sort: { lastViewed: -1 }
      },
      {
        $limit: 4
      }
    ]);

    const productIds = activities.map(a => a._id);

    const products = await Product.find({
      _id: { $in: productIds },
      isActive: true
    });

    res.json({ products });

  } catch (error) {

    console.error("Recent views error:", error);

    res.status(500).json({
      products: []
    });

  }

};



/* ================= RECOMMENDED PRODUCTS ================= */

exports.getRecommended = async (req, res) => {

  try {

    const { productId } = req.params;

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.json({ products: [] });
    }

    const products = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId }
    }).limit(5);

    res.json({ products });

  } catch (err) {

    console.error("Recommended error:", err);

    res.status(500).json({
      products: []
    });

  }

};



/* ================= CUSTOMERS ALSO BOUGHT ================= */

exports.getAlsoBought = async (req, res) => {

  try {

    const { productId } = req.params;

    const objectId = new mongoose.Types.ObjectId(productId);

    const users = await Order.distinct("user", {
      "items.product": objectId,
      orderStatus: { $ne: "cancelled" }
    });

    if (!users.length) {
      return res.json({ products: [] });
    }

    const recommendations = await Order.aggregate([
      {
        $match: {
          user: { $in: users },
          orderStatus: { $ne: "cancelled" }
        }
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.product": { $ne: objectId }
        }
      },
      {
        $group: {
          _id: "$items.product",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const productIds = recommendations.map(r => r._id);

    const products = await Product.find({
      _id: { $in: productIds },
      isApproved: true,
      isActive: true
    });

    res.json({ products });

  } catch (error) {

    console.error("AlsoBought Error:", error);

    res.status(500).json({ products: [] });

  }

};