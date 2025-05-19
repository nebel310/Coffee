import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import Header from './components/header';
import Footer from './components/footer';
import { getProducts, addToCart, getCurrentUser, login, register, logout } from './api';

function MainPage({ token, user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1, token);
      setToastMessage(`${product.title} добавлен в корзину`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Загрузка...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Нет доступных продуктов</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mainBody">
      <Header />
      
      <main className="shopContainer">
        {products.map((product) => (
          <div key={product.id} className="shopPositionContainer">
            <img 
              className="shopPositionImg" 
              src={product.image_path}
              alt={product.title} 
              onError={(e) => {
                e.target.src = '/icons/default-product.png';
              }}
            />
            <div className="shopPositionName">
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <button className="shopPositionButtonAddition">Состав</button>
            </div>
            <div className="shopPositionButtons">
              <button className="qtyBtn" onClick={() => handleAddToCart(product)}>
                +
              </button>
              <div className="shopPositionButtonBot">{product.price}р.</div>
            </div>
          </div>
        ))}
      </main>
      
      {toastMessage && (
        <div className="toast-message">
          {toastMessage}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getCurrentUser(token)
        .then(user => setUser(user))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const handleLogin = async (loginData) => {
    try {
      const response = await login(loginData);
      setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      navigate('/');
    } catch (error) {
      alert('Ошибка входа: ' + error.message);
    }
  };

  const handleRegister = async (registerData) => {
    try {
      await register(registerData);
      alert('Регистрация успешна! Можете войти.');
      navigate('/profile');
    } catch (error) {
      alert('Ошибка регистрации: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout(token);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <MainPage 
            token={token} 
            user={user} 
            onLogout={handleLogout} 
          />
        } 
      />
      <Route path="/history" element={<HistoryPage token={token} />} />
      <Route 
        path="/profile" 
        element={
          <ProfilePage 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
            user={user} 
            onLogout={handleLogout} 
          />
        } 
      />
      <Route path="/cart" element={<CartPage token={token} />} />
    </Routes>
  );
}