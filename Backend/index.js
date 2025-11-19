require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs'); // <-- needed for Step 4
const userRoutes = require("./routes/UserRoutes");
const productRoutes = require("./routes/Products");
const adminRoutes = require("./routes/adminroutes");
const cartRoutes = require("./routes/CartRoutes");
const connDB = require('./config/db');
const cors = require("cors");
const orderRoutes = require ("./routes/OrderRoutes")
const adminDashboardRoutes = require("./routes/admindashboardroutes");
const authRoutes = require("./routes/authroutes");


const app = express();
app.use(express.json());

// Connect backend with frontend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Connect to MongoDB
connDB();

// -------- STEP 4: Ensure uploads folder exists --------
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Uploads folder created!");
}
// ------------------------------------------------------

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/api/product", productRoutes);
app.use("/admin", adminRoutes);
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/auth", authRoutes);


app.use("/admin", adminDashboardRoutes);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
