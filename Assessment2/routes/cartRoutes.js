const express = require('express');
const router = express.Router();

// Cart model (确保已经定义)
const Cart = require('../models/Cart');

// 添加到购物车的 API
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // 查找用户的购物车
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // 检查产品是否已经在购物车中
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            // 更新数量
            cart.items[itemIndex].quantity += quantity;
        } else {
            // 添加新产品
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get user cart by userId
router.get("/cart/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        // Validate userId
        if (!userId) {
            return res.status(400).send({ message: "User  ID is required" });
        }

        console.log('Received userId:', userId);

        // Check if the user exists
        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).send({ message: "User  not found" });
        }

        console.log('Found user:', user);

        // Find the cart for the specified userId
        const cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        // Send the cart data back to the client
        res.status(200).send(cart);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});
module.exports = router;
