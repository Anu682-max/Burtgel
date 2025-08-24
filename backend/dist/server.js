"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("./models/User"));
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userapp';
mongoose_1.default.connect(mongoUri)
    .then(() => console.log('MongoDB холбогдлоо'))
    .catch(err => console.error('MongoDB холболтын алдаа:', err));
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];
app.get('/', (req, res) => {
    res.json({
        message: 'CRUD User Management API',
        version: '1.0.0',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});
app.get('/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});
app.post('/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Энэ имэйлээр бүртгүүлсэн хэрэглэгч байна' });
        }
        const user = new User_1.default({ name, email, password });
        await user.save();
        const token = (0, auth_1.generateToken)(user._id.toString());
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Буруу имэйл эсвэл нууц үг' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Буруу имэйл эсвэл нууц үг' });
        }
        const token = (0, auth_1.generateToken)(user._id.toString());
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/auth/me', auth_1.authenticateToken, (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});
app.get('/users', (req, res) => {
    res.status(200).json(users);
});
app.post('/users', (req, res) => {
    const newUser = req.body;
    const id = users.length + 1;
    const userWithId = { id, ...newUser };
    users.push(userWithId);
    res.status(201).json(userWithId);
});
app.put('/users/:id', (req, res) => {
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
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
});
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    if (!users.some((user) => user.id === parseInt(id))) {
        return res.status(404).json({ message: 'User not found' });
    }
    else {
        users = users.filter(user => user.id !== parseInt(id));
        res.status(200).json({ message: 'User deleted successfully' });
    }
});
app.listen(port, () => {
    console.log(`Сервер ажиллаж байна аа http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map