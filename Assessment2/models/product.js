const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true }, // Track product stock
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true }, // Seller associated with the product
  reviews: [{ user: String, comment: String, rating: Number }],
  createdAt: { type: Date, default: Date.now }, // Timestamp when the product is created
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
