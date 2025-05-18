import React, { useState } from 'react';
import '../App.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function ProfilePage({ onLogin, onRegister, user, onLogout }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: ''
  });
  const [registerErrors, setRegisterErrors] = useState({});

  const validateRegisterForm = () => {
    const errors = {};
    let isValid = true;

    if (!registerForm.username.trim()) {
      errors.username = 'Введите имя пользователя';
      isValid = false;
    }

    if (!registerForm.email.trim()) {
      errors.email = 'Введите email';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) {
      errors.email = 'Введите корректный email';
      isValid = false;
    }

    if (!registerForm.phone.trim()) {
      errors.phone = 'Введите телефон';
      isValid = false;
    }

    if (!registerForm.password) {
      errors.password = 'Введите пароль';
      isValid = false;
    } else if (registerForm.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
      isValid = false;
    }

    if (!registerForm.password_confirm) {
      errors.password_confirm = 'Подтвердите пароль';
      isValid = false;
    } else if (registerForm.password !== registerForm.password_confirm) {
      errors.password_confirm = 'Пароли не совпадают';
      isValid = false;
    }

    setRegisterErrors(errors);
    return isValid;
  };

  const handleRegisterSubmit = () => {
    if (validateRegisterForm()) {
      onRegister({
        username: registerForm.username,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        password_confirm: registerForm.password_confirm
      });
    }
  };

  if (user) {
    return (
      <div className="mainBody">
        <Header />
        <div className="profileContainer">
          <h2>Профиль</h2>
          <div>
            <p>Имя: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Телефон: {user.phone}</p>
            <button className="loginButton" onClick={onLogout}>Выйти</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mainBody">
      <Header />

      <div className="loginContainer">
        {/* Вход */}
        <div className="loginPart">
          <h2 className="loginHead">Вход</h2>
          <div style={{ textAlign: 'left', paddingLeft: '10%' }}>
            <label>Email:</label><br />
            <input
              className="loginField"
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              required
            /><br /><br />
            <label>Пароль:</label><br />
            <input
              className="loginField"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            /><br /><br />
            <button className="loginButton" onClick={() => onLogin(loginForm)}>Вход</button>
          </div>
        </div>

        {/* Регистрация */}
        <div className="regPart">
          <h2 className="loginHead">Регистрация</h2>
          <div style={{ textAlign: 'left', paddingLeft: '10%' }}>
            <label>Имя:</label><br />
            <input
              className={`loginField ${registerErrors.username ? 'error' : ''}`}
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
            />
            {registerErrors.username && <div className="error-message">{registerErrors.username}</div>}
            <br />
            
            <label>Email:</label><br />
            <input
              className={`loginField ${registerErrors.email ? 'error' : ''}`}
              type="email"
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            {registerErrors.email && <div className="error-message">{registerErrors.email}</div>}
            <br />
            
            <label>Телефон:</label><br />
            <input
              className={`loginField ${registerErrors.phone ? 'error' : ''}`}
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
            />
            {registerErrors.phone && <div className="error-message">{registerErrors.phone}</div>}
            <br />
            
            <label>Пароль:</label><br />
            <input
              className={`loginField ${registerErrors.password ? 'error' : ''}`}
              type="password"
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
            />
            {registerErrors.password && <div className="error-message">{registerErrors.password}</div>}
            <br />
            
            <label>Подтвердите пароль:</label><br />
            <input
              className={`loginField ${registerErrors.password_confirm ? 'error' : ''}`}
              type="password"
              value={registerForm.password_confirm}
              onChange={(e) => setRegisterForm({ ...registerForm, password_confirm: e.target.value })}
            />
            {registerErrors.password_confirm && <div className="error-message">{registerErrors.password_confirm}</div>}
            <br />
            
            <button className="loginButton" onClick={handleRegisterSubmit}>Регистрация</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}