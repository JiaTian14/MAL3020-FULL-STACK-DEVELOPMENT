const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, default: 0 },
});

const CartModel = mongoose.model('Cart', cartSchema);
module.exports = CartModel;
