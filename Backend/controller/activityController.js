
const Product = require("../models/Product");
const UserActivity = require("../models/UserActivity");



/* ================= TRACK ACTIVITY ================= */

exports.trackActivity = async (req, res) => {

  try {

    const { productId, action } = req.body;

    await UserActivity.create({

      userId: req.user._id,
      productId,
      action

    });

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      success: false
    });

  }

};


/* ================= RECOMMENDED FOR USER ================= */

exports.getRecommended = async (req, res) => {

  try {

    const { productId } = req.params;

    const currentProduct = await Product.findById(productId);

    if (!currentProduct)
      return res.json({ products: [] });

    const recommendations = await Product.find({
      category: currentProduct.category,
      _id: { $ne: productId }
    })
    .limit(5);

    res.json({
      products: recommendations
    });

  } catch (err) {

    res.status(500).json({
      products: []
    });

  }

};


/* ================= CUSTOMERS ALSO BOUGHT ================= */

exports.getAlsoBought = async (req, res) => {

  try {

    const { productId } = req.params;

    const users = await UserActivity
      .find({
        productId,
        action: "purchase"
      })
      .distinct("userId");

    const recommendations =
      await UserActivity.find({

        userId: { $in: users },
        productId: { $ne: productId },
        action: "purchase"

      })
      .populate("productId");

    const products =
      recommendations.map(
        r => r.productId
      );

    res.json(products);

  } catch {

    res.status(500).json([]);

  }

};


/* ================= POPULAR PRODUCTS ================= */

exports.getPopular = async (req, res) => {

  try {

    const popular =
      await UserActivity.aggregate([

        {
          $match: {
            action: "purchase"
          }
        },

        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 }
          }
        },

        {
          $sort: {
            count: -1
          }
        },

        {
          $limit: 10
        }

      ]);

    const ids =
      popular.map(p => p._id);

    const products =
      await Product.find({
        _id: { $in: ids }
      });

    res.json(products);

  } catch {

    res.status(500).json([]);

  }

};