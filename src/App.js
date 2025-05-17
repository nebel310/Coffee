import React, { useState, useEffect } from 'react';

import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';


import Header from './components/header';
import Footer from './components/footer';

function MainPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                price: item.unit * (item.quantity + 1),
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          price: product.unit,
        },
      ]);
    }
  
    // Показываем сообщение
    setToastMessage(`${product.name} добавлен в корзину`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const menu = [
    {
      id: 1,
      name: 'Кофе Латте',
      description: 'Кофейный напиток, который состоит из эспрессо, горячего молока и молочной пены.',
      image: '/menu/1.png',
      unit: 250,
    },
    {
      id: 2,
      name: 'Пирожное Картошка',
      description: 'Шоколадное пирожное с печеньем внутри в виде маленькой картошки.',
      image: '/menu/2.png',
      unit: 100,
    },
  ];

  return (
    <div className="mainBody">
      <Header />

      <main className="shopContainer">
        {menu.map((item) => (
          <div key={item.id} className="shopPositionContainer">
            <img className="shopPositionImg" src={item.image} alt={item.name} />
            <div className="shopPositionName">
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <button className="shopPositionButtonAddition">Состав</button>
            </div>
            <div className="shopPositionButtons">
              <button className="qtyBtn" onClick={() => handleAddToCart(item)}>
                +
              </button>
              <div className="shopPositionButtonBot">{item.unit}р.</div>
            </div>
          </div>
        ))}
      </main>
      {toastMessage && <div className="toast">{toastMessage}</div>}

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/cart" element={<CartPage />} />

    </Routes>
  );
}
