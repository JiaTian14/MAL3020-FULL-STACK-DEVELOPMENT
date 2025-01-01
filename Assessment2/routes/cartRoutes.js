const express = require('express');
const router = express.Router();
const Cart = require('../models/cart'); // Corrected the path to the Cart model

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
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching cart for userId: ${userId}`); // Debugging

    try {
        // Query the database
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        
        // Check if cart exists
        if (!cart) {
            console.error(`Cart not found for userId: ${userId}`);
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Return the cart data
        res.status(200).json({ success: true, data: { cart } });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
