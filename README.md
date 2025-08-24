# 🚀 CRUD User Management System

Энэ нь React болон Node.js ашиглан хийсэн бүрэн хэрэглэгчийн мэдээлэл удирдах систем юм.

## ✨ Боломжууд

### 🔐 Authentication
- JWT токен ашигласан найдвартай нэвтрэх систем
- Хэрэглэгч бүртгүүлэх/нэвтрэх
- Автомат токен хадгалах (localStorage)

### 📋 CRUD Operations
- **Create** - Шинэ хэрэглэгч нэмэх
- **Read** - Хэрэглэгчдийн жагсаалт харах
- **Update** - Хэрэглэгчийн мэдээлэл засах
- **Delete** - Хэрэглэгч устгах

### 🎨 Modern UI/UX
- Gradient background болон glass morphism эффект
- Hover animations болон гоё transition
- Mobile responsive дизайн
- Өнгөөр ялгагдсан товчнууд

### 🗄️ Database Support
- MongoDB ашиглах боломжтой
- Mongoose ODM
- Password encryption (bcrypt)

## 🛠️ Технологи

### Frontend
- React 18+
- Modern CSS3 (Grid, Flexbox, Animations)
- Responsive Design
- JWT Token handling

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt Password Encryption
- CORS enabled

## 🚀 Суулгах заавар

### 1. Repository clone хийх
```bash
git clone https://github.com/Anu682-max/Burtgel.git
cd Burtgel
```

### 2. Backend суулгах
```bash
cd backend
npm install
npm start
```
Backend сервер http://localhost:3001 дээр ажиллана.

### 3. Frontend суулгах
```bash
cd frontend
npm install
npm start
```
Frontend апп http://localhost:3000 дээр ажиллана.

## 📱 Ашиглах заавар

1. **Бүртгүүлэх**: Шинэ хэрэглэгчээр бүртгүүлнэ үү
2. **Нэвтрэх**: Өөрийн мэдээллээр нэвтэрнэ үү
3. **CRUD**: Хэрэглэгч нэмэх, засах, устгах үйлдлүүд хийнэ үү

## 🔧 Тохиргоо

### MongoDB холболт
Backend дотор `server.js` файлд MongoDB холболтын тохиргоог өөрчилж болно:
```javascript
mongoose.connect('mongodb://localhost:27017/userapp')
```

### Портыг өөрчлөх
- Backend: `server.js` дотор `port = 3001`
- Frontend: `package.json` эсвэл `.env` файлд `PORT=3000`

## 📋 API Endpoints

### Authentication
- `POST /auth/register` - Хэрэглэгч бүртгүүлэх
- `POST /auth/login` - Нэвтрэх  
- `GET /auth/me` - Хэрэглэгчийн мэдээлэл авах

### CRUD Operations
- `GET /users` - Бүх хэрэглэгч харах
- `POST /users` - Шинэ хэрэглэгч нэмэх
- `PUT /users/:id` - Хэрэглэгч шинэчлэх
- `DELETE /users/:id` - Хэрэглэгч устгах

## 🤝 Хувь нэмэр оруулах

1. Fork хийнэ үү
2. Feature branch үүсгэнэ үү (`git checkout -b feature/AmazingFeature`)
3. Commit хийнэ үү (`git commit -m 'Add some AmazingFeature'`)
4. Push хийнэ үү (`git push origin feature/AmazingFeature`)
5. Pull Request нээнэ үү

## 📄 License

Энэ төсөл MIT лицензтэй.

## 👨‍💻 Хөгжүүлэгч

**Anu682-max** - [GitHub](https://github.com/Anu682-max)

---

⭐ Хэрвээ энэ төсөл танд таалагдсан бол star өгч болно уу!
