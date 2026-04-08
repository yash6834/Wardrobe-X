require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const connDB = require("./config/db");

/* ================= ROUTES ================= */
const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authroutes");
const productRoutes = require("./routes/Products");
const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const adminRoutes = require("./routes/adminroutes");
const adminDashboardRoutes = require("./routes/admindashboardroutes");
const vendorRoutes = require("./routes/VendorRoutes");
const adminProductRoutes = require("./routes/AdminProductRoutes");
const payoutRoutes = require("./routes/PayoutRoutes");
const membershipRoutes = require("./routes/MemmbershipRoutes");
const returnRoutes = require("./routes/ReturnRoutes");
const notificationRoutes = require("./routes/NotificationRoutes");
const CMSRoutes = require("./routes/CMSRoutes");
const activityroutes = require("./routes/ActivityRoutes");
const recommendationRoutes = require("./routes/Recomendation");
const paymentRoutes = require("./routes/Payment");
const fraudRoutes = require("./routes/Froud");
const currencyRoutes = require("./routes/CurrencyRoutes");
const { router: pushRoutes } = require("./routes/pushRoutes");
const checkVendorActive = require("./middlewares/CheckVendoAactive");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* ================= DATABASE ================= */
connDB();

/* ================= UPLOADS ================= */
const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */

// 🔐 AUTH & USER
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 🛍️ USER FLOW
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 🔁 RETURNS & EXCHANGE
app.use("/api/returns", returnRoutes);

// 🎫 MEMBERSHIP
app.use("/api/membership", membershipRoutes);

// 🧑‍💼 ADMIN
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminRoutes);

// 🏪 VENDOR (🔥 WITH GLOBAL STATUS CHECK)
app.use("/api/vendor", checkVendorActive, vendorRoutes);

// 💰 PAYOUT
app.use("/api", payoutRoutes);

// 🔔 NOTIFICATIONS
app.use("/api/notifications", notificationRoutes);

// 📰 CMS
app.use("/api/cms", CMSRoutes);

// 📊 ACTIVITY TRACKING
app.use("/api/activity", activityroutes);

// 🤖 RECOMMENDATIONS
app.use("/api/recommendations", recommendationRoutes);

// 💳 PAYMENTS
app.use("/api", paymentRoutes);

// 🛡️ FRAUD DETECTION
app.use("/api", fraudRoutes);

// 💱 CURRENCY
app.use("/api/currency", currencyRoutes);

// 🔔 PUSH NOTIFICATIONS
app.use("/api", pushRoutes);



/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("🚀 Wardrobe X API running...");
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});