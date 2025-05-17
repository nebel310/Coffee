import React, { useState } from 'react';
import '../App.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function ProfilePage() {
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    login: '',
    password: '',
    email: '',
    phone: ''
  });

  const handleLogin = () => {
    alert(`Вход: ${loginForm.login} / ${loginForm.password}`);
    // Здесь можно добавить проверку или API-запрос
  };

  const handleRegister = () => {
    alert(`Регистрация: ${JSON.stringify(registerForm, null, 2)}`);
    // Здесь можно добавить проверку или API-запрос
  };

  return (
    <div className="mainBody">
      <Header />

      <div className="loginContainer">
        {/* Вход */}
        <div className="loginPart">
          <h2 className="loginHead">Вход</h2>
          <div style={{ textAlign: 'left', paddingLeft: '10%' }}>
            <label>Логин:</label><br />
            <input
              className="loginField"
              type="text"
              value={loginForm.login}
              onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
            /><br /><br />
            <label>Пароль:</label><br />
            <input
              className="loginField"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            /><br /><br />
            <button className="loginButton" onClick={handleLogin}>Вход</button>
          </div>
        </div>

        {/* Регистрация */}
        <div className="regPart">
          <h2 className="loginHead">Регистрация</h2>
          <div style={{ textAlign: 'left', paddingLeft: '10%' }}>
            <label>Логин:</label><br />
            <input
              className="loginField"
              type="text"
              value={registerForm.login}
              onChange={(e) => setRegisterForm({ ...registerForm, login: e.target.value })}
            /><br /><br />
            <label>Пароль:</label><br />
            <input
              className="loginField"
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            /><br /><br />
            <label>Почта:</label><br />
            <input
              className="loginField"
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            /><br /><br />
            <label>Телефон:</label><br />
            <input
              className="loginField"
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            /><br /><br />
            <button className="loginButton" onClick={handleRegister}>Регистрация</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}