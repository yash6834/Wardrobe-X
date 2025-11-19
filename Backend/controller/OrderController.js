const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      address,   // required
      phone,
      city,
      state,
      zip,
      paymentMethod
    } = req.body;

    // Make sure address is provided
    if (!address) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    const newOrder = await Order.create({
      customerName: req.user.name,
      email: req.user.email,
      phone,
      address,
      city,
      state,
      zip,
      paymentMethod,
      items,
      totalAmount,
      status: "Pending",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get orders (admin = all, user = own)
/* const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}; */
// Get orders (admin = all, user = own)
const getOrders = async (req, res) => {
  try {
    let ordersQuery;

    if (req.user.role === "admin") {
      // Admin → all orders
      ordersQuery = Order.find();
    } else {
      // User → only their orders
      ordersQuery = Order.find({ email: req.user.email });
    }

    // Populate product details (name, image, price)
    const orders = await ordersQuery
      .populate("items.productId", "name image price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// Update order status (admin only)
// ✅ Update Order Status Controller (Admin Only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = { createOrder, getOrders, updateOrderStatus };
