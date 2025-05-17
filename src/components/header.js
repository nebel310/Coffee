import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header>
    <div className="logoContainer">
      <img className="logo" src="/icons/logo.png" alt="Чашка" />
    </div>
    <div className="menuContainer">
      <button className="shushaIconButton" onClick={() => navigate('/history')}>
        <img src="/icons/history.png" alt="История" className="logo" />
      </button>
      <button className="shushaIconButton" onClick={() => navigate('/cart')}>
        <img src="/icons/cart.png" alt="Корзина" className="logo" />
      </button>
      <button className="shushaIconButton" onClick={() => navigate('/profile')}>
        <img src="/icons/user.png" alt="Профиль" className="logo" />
      </button>
      <button className="shushaIconButton" onClick={() => navigate('/')}>
        <img src="/icons/coffee.png" alt="Меню" className="logo" />
      </button>
    </div>
  </header>
  );
}