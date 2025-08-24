import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User';
import { generateToken, authenticateToken, requireAdmin } from './middleware/auth';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB холболт
mongoose.connect('mongodb://localhost:27017/userapp')
  .then(() => console.log('MongoDB холбогдлоо'))
  .catch(err => console.error('MongoDB холболтын алдаа:', err));

// In-memory users (MongoDB ашиглахгүй бол)
interface SimpleUser {
  id: number;
  name: string;
  email: string;
}

let users: SimpleUser[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Authentication APIs
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    // Хэрэглэгч байгаа эсэхийг шалгах
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Энэ имэйлээр бүртгүүлсэн хэрэглэгч байна' });
    }

    // Шинэ хэрэглэгч үүсгэх
    const user = new User({ name, email, password });
    await user.save();

    // Token үүсгэх
    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      message: 'Амжилттай бүртгүүллээ',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Хэрэглэгчийг олох
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Буруу имэйл эсвэл нууц үг' });
    }

    // Нууц үг шалгах
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Буруу имэйл эсвэл нууц үг' });
    }

    // Token үүсгэх
    const token = generateToken((user._id as any).toString());

    res.json({
      message: 'Амжилттай нэвтэрлээ',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Хэрэглэгчийн мэдээлэл авах (authentication шаардлагатай)
app.get('/auth/me', authenticateToken, (req: Request, res: Response) => {
  res.json({
    user: {
      id: (req as any).user._id,
      name: (req as any).user.name,
      email: (req as any).user.email,
      role: (req as any).user.role
    }
  });
});

// Simple CRUD APIs (authentication-гүй)
app.get('/users', (req: Request, res: Response) => {
  res.status(200).json(users);
});

app.post('/users', (req: Request, res: Response) => {
  const newUser = req.body;
  const id = users.length + 1;
  const userWithId = { id, ...newUser };
  users.push(userWithId);
  res.status(201).json(userWithId);
});

// PUT - Update user information
app.put('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  let updated = false;
  users = users.map(user => {
    if (user.id === parseInt(id)) {
      updated = true;
      return { id: user.id, name, email };
    }
    return user;
  });

  if (updated) {
    res.status(200).json({ id: parseInt(id), name, email });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// DELETE - Delete a user
app.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!users.some((user) => user.id === parseInt(id))) {
    return res.status(404).json({ message: 'User not found' });
  } else {
    users = users.filter(user => user.id !== parseInt(id));
    res.status(200).json({ message: 'User deleted successfully' });
  }
});

app.listen(port, () => {
  console.log(`Сервер ажиллаж байна аа http://localhost:${port}`);
});
