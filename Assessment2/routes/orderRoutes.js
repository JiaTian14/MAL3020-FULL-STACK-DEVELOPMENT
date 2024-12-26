const express = require('express');
const Order = require('../models/order');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, products } = req.body;
  try {
    const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = new Order({ user: userId, products, totalPrice });
    await order.save();

    const user = await User.findById(userId);
    user.orderHistory.push(order._id);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
