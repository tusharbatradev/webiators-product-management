const mongoose = require('mongoose');
const Product = require('../models/Product');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: { products } });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProductById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, data: { product } });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: { product },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
