const Product = require("../models/Product");

const UserActivity = require("../models/UserActivity");

exports.getHeroRecommendations = async (req, res) => {
  try {
    console.log("REQ USER:", req.user)
    const userId = req.user?._id;

    let recentViews = [];
    let recommended = [];

    if (userId) {

      const recentActivity = await UserActivity
        .find({ userId, action: "view" })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate("productId");

      recentViews = recentActivity.map(a => a.productId).filter(Boolean);

      const categoryData = await UserActivity.aggregate([
        { $match: { userId, action: "view" } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product.category",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      if (categoryData.length > 0) {
        recommended = await Product.find({
          category: categoryData[0]._id
        }).limit(4);
      }
    }

    if (recommended.length === 0) {
      recommended = await Product.find().limit(4);
    }

    res.json({ recentViews, recommended });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Hero recommendation error" });
  }
};