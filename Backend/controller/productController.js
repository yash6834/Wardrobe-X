const Product = require("../models/Product");

/* ===============================
   CREATE PRODUCT
   =============================== */
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

    // ✅ MULTIPLE IMAGE SUPPORT
    const imageUrls = req.files && req.files.length > 0
      ? req.files.map(file => `/uploads/${file.filename}`)
      : [];

    const newProduct = new Product({
      vendor: req.user._id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      image: imageUrls,
      isApproved: false,
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


/* ===============================
   GET ALL PRODUCTS
   =============================== */
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


/* ===============================
   GET PRODUCT BY ID
   =============================== */
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

    // ✅ MULTIPLE IMAGES FULL URL
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

    /* ================= BASIC FIELDS ================= */

    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.subCategory !== undefined) product.subCategory = req.body.subCategory;
    if (req.body.price !== undefined) product.price = Number(req.body.price);

    /* ================= SIZES ================= */

    if (req.body.sizes !== undefined) {
      product.sizes =
        typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
    }

    /* ================= IMAGE UPDATE ================= */

    // Step 1: Get existing images from frontend
    let existingImages = [];

    if (req.body.existingImages) {
      existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
    } else {
      // If frontend didn't send, keep old images
      existingImages = product.image || [];
    }

    // Step 2: Get new uploaded images
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Step 3: Merge both
    let finalImages = [...existingImages, ...newImages];

    // Step 4: Limit to max 5 images
    finalImages = finalImages.slice(0, 5);

    // Step 5: Update product images
    product.image = finalImages;

    /* ================= SAVE ================= */

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
   DELETE PRODUCT
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