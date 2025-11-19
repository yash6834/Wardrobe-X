const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  size : { type : String, require : true},
  description: { type: String },
  image: { type: String } // URL or path to image
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
