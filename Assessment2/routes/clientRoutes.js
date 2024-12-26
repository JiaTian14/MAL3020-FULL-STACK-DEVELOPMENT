const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller'); // Import the Seller model
const router = express.Router();

// Secret key for JWT
const JWT_SECRET = 'your_secret_key';

// Registration endpoint
router.post('/register', async (req, res) => {
    const { username, email, shopName, password } = req.body;

    try {
        // Check if the email already exists
        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new seller instance
        const newSeller = new Seller({
            username,
            email,
            shopName,
            password: hashedPassword,
        });

        // Save the new seller to the database
        await newSeller.save();

        // Send success response
        res.status(201).json({ message: 'Seller registered successfully!' });
    } catch (err) {
        console.error('Error registering seller:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the seller exists by email
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ sellerId: seller._id }, JWT_SECRET, { expiresIn: '1h' });

        // Send response with the token
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error logging in seller:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
