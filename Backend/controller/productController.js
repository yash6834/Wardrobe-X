const Product = require("../models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, size, stock } = req.body;
    //const sizes = JSON.parse(size); // from frontend JSON
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      subCategory,
      //size: sizes,
      stock,
      image: imageUrl
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
};


// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    console.log("Fetched product:", product); // <— add this

    // Build full URL for the image
    const imageUrl = product.image
      ? `${req.protocol}://${req.get('host')}${product.image}`
      : null;

    res.status(200).json({
      ...product.toObject(),
      image: imageUrl,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update fields from req.body
    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.category) product.category = req.body.category;
    if (req.body.subCategory) product.subCategory = req.body.subCategory;
    if (req.body.price) product.price = Number(req.body.price);
    if (req.body.stock) product.stock = Number(req.body.stock);
    if (req.body.size) product.size = JSON.parse(req.body.size); // array

    // Update image if new one uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({ message: 'Product updated successfully', product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




