// models/Cart.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  totalPrice: { type: Number, default: 0 },
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;
