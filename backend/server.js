const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const { generateToken, authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB холболт
mongoose.connect('mongodb://localhost:27017/userapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB холбогдлоо'))
.catch(err => console.error('MongoDB холболтын алдаа:', err));

// In-memory users (MongoDB ашиглахгүй бол)
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Authentication APIs
app.post('/auth/register', async (req, res) => {
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
        const token = generateToken(user._id);

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
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
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
        const token = generateToken(user._id);

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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Хэрэглэгчийн мэдээлэл авах (authentication шаардлагатай)
app.get('/auth/me', authenticateToken, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Simple CRUD APIs (authentication-гүй)
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

app.post('/users', (req, res) => {
    const newUser = req.body; // Get the new user data from the request body
    const id = users.length + 1; // Generate a unique ID for the new user
    newUser.id = id; // Assign the ID to the new user object
    users.push(newUser); // Add the new user to the users array
    res.status(201).json(newUser); // Send the new user data as JSON
});

// PUT - Update user information
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body; // Get the updated user data from the request body

    let updated = false;
    users = users.map(user => {
        if (user.id === parseInt(id)) {
            updated = true;
            return { id: user.id, name, email };
        }
        return user;
    });

    if (updated) {
        res.status(200).json({ id: parseInt(id), name, email }); // Send the updated user data as JSON
    } else {
        res.status(404).json({ message: 'User not found' }); // Send a 404 response if the user is not found
    }
});

// DELETE - Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    
    if (!users.some((user) => user.id === parseInt(id))) {
        return res.status(404).json({ message: 'User not found' }); // Send not found response
    } else {
        users = users.filter(user => user.id !== parseInt(id));
        res.status(200).json({ message: 'User deleted successfully' }); // Send success response
    }
});

app.listen(port, () => {
    console.log(`Сервер ажиллаж байна аа http://localhost:${port}`);
}); // Start the server and listen on the specified port
