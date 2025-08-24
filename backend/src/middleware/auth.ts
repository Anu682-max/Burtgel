import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Extended Request interface
export interface AuthRequest extends Request {
  user?: IUser;
}

// JWT токен үүсгэх
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Token шалгах middleware
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access token шаардлагатай' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.status(401).json({ message: 'Хэрэглэгч олдсонгүй' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Буруу эсвэл хугацаа дууссан токен' });
  }
};

// Admin эрх шалгах middleware
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin эрх шаардлагатай' });
    return;
  }
  next();
};
