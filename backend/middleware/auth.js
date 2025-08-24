const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// JWT токен үүсгэх
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Token шалгах middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token шаардлагатай' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Хэрэглэгч олдсонгүй' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Буруу эсвэл хугацаа дууссан токен' });
  }
};

// Admin эрх шалгах middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin эрх шаардлагатай' });
  }
  next();
};

module.exports = {
  generateToken,
  authenticateToken,
  requireAdmin
};
