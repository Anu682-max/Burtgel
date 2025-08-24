import { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editId, setEditId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  // Authentication шалгах
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Backend-с хэрэглэгчдийн мэдээллийг авах
  useEffect(() => {
    if (currentUser) {
      fetch('http://localhost:3001/users')
        .then((response) => response.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [currentUser]);

  // Нэвтэрсэн үед дуудагдах
  const handleLogin = (user, userToken) => {
    setCurrentUser(user);
    setToken(userToken);
  };

  // Гарах
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    setUsers([]);
  };

  // Нэвтрээгүй бол auth хэсэг харуулах
  if (!currentUser) {
    return <Auth onLogin={handleLogin} isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  // Хэрэглэгч нэмэх
  const addUser = (user) => {
    fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]);
        setName('');
        setEmail('');
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  // Хэрэглэгчийн мэдээллийг шинэчлэх
  const updateUser = (id, user) => {
    fetch(`http://localhost:3001/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(users.map((u) => (u.id === id ? data : u)));
        setEditId(null);
        setName('');
        setEmail('');
      })
      .catch((error) => console.error('Error updating user:', error));
  };

  // Форм submit хийхэд дуудагдана
  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      if (editId) {
        updateUser(editId, { name, email });
      } else {
        addUser({ name, email });
      }
    }
  };

  // Засах товч дарахад
  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // Хэрэглэгчийн мэдээллийг устгах
  const deleteUser = (id) => {
    fetch(`http://localhost:3001/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        if (editId === id) {
          setEditId(null);
          setName('');
          setEmail('');
        }
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <div className="container">
      <div className="header">
        <div className="user-welcome">
          Сайн байна уу, <strong>{currentUser.name}</strong>!
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Гарах
        </button>
      </div>

      <h2>Хэрэглэгч {editId ? 'шинэчлэх' : 'нэмэх'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Нэр:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Имэйл:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">{editId ? 'Шинэчлэх' : 'Нэмэх'}</button>
        {editId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditId(null);
              setName('');
              setEmail('');
            }}
          >
            Болих
          </button>
        )}
      </form>

      <h3>Хэрэглэгчдийн мэдээллийг харах</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-info">{user.name} ({user.email})</div>
            <div className="button-group">
              <button className="edit-btn" onClick={() => handleEdit(user)}>Засах</button>
            </div>
          </li>
        ))}
      </ul>
      <h3>Хэрэглэгчийн мэдээллийг устгах</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div className="user-info">{user.name} ({user.email})</div>
            <div className="button-group">
              <button className="delete-btn" onClick={() => deleteUser(user.id)}>Устгах</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;