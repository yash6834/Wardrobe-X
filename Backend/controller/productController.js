const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
    } = req.body;

    const parsedSizes =
      typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    const imageUrls = req.file
      ? [`/uploads/${req.file.filename}`]
      : [];

    const newProduct = new Product({
      vendor: req.user._id,      // ✅ REQUIRED
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      image: imageUrls,
      isApproved: false,         // ✅ admin approval required
      isActive: true,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added. Awaiting admin approval.",
      product: newProduct,
    });
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({
      success: false,
      message: "Error adding product",
    });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isApproved: true,
      isActive: true,
    }).sort({ createdAt: -1 });

    const activeMembership =
      req.user?.memberships?.find(
        (m) => m.isActive && new Date(m.endDate) > new Date()
      ) || null;

    const discountPercent = activeMembership?.discountPercent || 0;

    const updatedProducts = products.map((product) => {
      const originalPrice = product.price;
      const finalPrice =
        discountPercent > 0
          ? originalPrice -
            Math.round((originalPrice * discountPercent) / 100)
          : originalPrice;

      return {
        ...product.toObject(),
        originalPrice,
        finalPrice,
        membershipDiscount: discountPercent,
      };
    });

    res.status(200).json({
      success: true,
      products: updatedProducts,
    });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isApproved: true,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not approved",
      });
    }

    const images = product.image.map(
      (img) => `${req.protocol}://${req.get("host")}${img}`
    );

    const activeMembership =
      req.user?.memberships?.find(
        (m) => m.isActive && new Date(m.endDate) > new Date()
      ) || null;

    const discountPercent = activeMembership?.discountPercent || 0;

    const originalPrice = product.price;
    const finalPrice =
      discountPercent > 0
        ? originalPrice -
          Math.round((originalPrice * discountPercent) / 100)
        : originalPrice;

    res.status(200).json({
      success: true,
      ...product.toObject(),
      image: images,
      originalPrice,
      finalPrice,
      membershipDiscount: discountPercent,
    });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



/* ===============================
   UPDATE PRODUCT
   =============================== */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Basic fields
    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.subCategory) product.subCategory = req.body.subCategory;
    if (req.body.price) product.price = Number(req.body.price);

    // Size-wise stock update
    if (req.body.sizes) {
      product.sizes =
        typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
    }

    // Image update
    if (req.file) {
      product.image = [`/uploads/${req.file.filename}`];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ===============================
   DELETE PRODUCT (OPTIONAL BUT USEFUL)
   =============================== */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
