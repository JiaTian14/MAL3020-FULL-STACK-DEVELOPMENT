const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    // Add other fields as necessary
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;