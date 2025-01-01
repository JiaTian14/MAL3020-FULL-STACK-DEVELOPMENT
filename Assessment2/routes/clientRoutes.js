const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Seller = require('/models/Seller'); // Import the Seller model
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

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Something went wrong." });
    }
});



module.exports = router;
