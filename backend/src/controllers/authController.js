const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateSignup, validateLogin } = require('../validators/authValidator');

const signup = async (req, res) => {
  const error = validateSignup(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const { username, password, name } = req.body;

  try {
    const existing = await User.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username already taken' });
    }

    const user = await User.create({ username: username.trim(), name: name.trim(), password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user: { id: user._id, username: user.username, name: user.name } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const login = async (req, res) => {
  const error = validateLogin(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username.trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: { id: user._id, username: user.username, name: user.name } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: { user: { id: user._id, username: user.username, name: user.name } },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { signup, login, getCurrentUser };
