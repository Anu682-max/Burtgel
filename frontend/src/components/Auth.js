import React, { useState } from 'react';

const Auth = ({ onLogin, isLogin, setIsLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Серверийн алдаа гарлаа');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <label>
              Нэр:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </label>
          )}
          
          <label>
            Имэйл:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          
          <label>
            Нууц үг:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </label>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Ачаалж байна...' : (isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх')}
          </button>
        </form>
        
        <p className="auth-switch">
          {isLogin ? 'Бүртгэл байхгүй юу? ' : 'Бүртгэл байгаа юу? '}
          <button 
            type="button" 
            className="link-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
