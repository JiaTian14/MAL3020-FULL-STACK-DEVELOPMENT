const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product by ID
router.put('/:productId', async (req, res) => {
  try {
      const productId = req.params.productId;
      const updatedData = req.body; // Get the updated data from the request body

      const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ success: true, data: updatedProduct }); // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
}
});

module.exports = router;
