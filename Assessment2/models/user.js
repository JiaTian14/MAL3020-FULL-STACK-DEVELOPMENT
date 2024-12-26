const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuidv4},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now},
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});
class APIError extends Error {
  constructor(message, statusCode) {
      super(message);
      this.name = 'APIError';
      this.statusCode = statusCode;
  }
}


module.exports = mongoose.model('User', userSchema);
