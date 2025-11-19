const User = require("../models/Registration");
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * Get total registered users
 */
exports.getTotalUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Error fetching total users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get total orders
 */
exports.getTotalOrders = async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Error fetching total orders:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get total products
 */
exports.getTotalProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Error fetching total products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get combined dashboard stats (users, orders, products)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, orders, products] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: users,
        totalOrders: orders,
        totalProducts: products,
      },
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get orders count grouped by date (for daily sales chart)
 */
exports.getOrdersByDate = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = orders.map((o) => ({
      date: o._id,
      count: o.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching orders by date:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get total sales grouped by month (for monthly sales chart)
 */
exports.getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const monthlySales = monthNames.map((name, i) => {
      const found = sales.find((s) => s._id === i + 1);
      return { month: name, total: found ? found.totalSales : 0 };
    });

    res.json(monthlySales);
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({ message: "Server error" });
  }
};
