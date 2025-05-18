import React, { useState, useEffect } from 'react';
import '../App.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { getUserOrders } from '../api';

export default function HistoryPage({ token }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getUserOrders(token)
        .then(data => {
          setOrders(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [token]);

  if (!token) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Для просмотра истории войдите в аккаунт</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Загрузка истории заказов...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">У вас пока нет заказов</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mainBody">
      <Header />

      <main className="historyContainer">
        {orders.map((order) => (
          <div className="historyPositionContainer" key={order.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                  <img src={item.product.image_path} alt={item.product.title} className="historyPositionImg" />
                  <span className="historyItemQuantity">x{item.quantity}</span>
                </div>
              ))}
              <div className="historyTotalPrice">= {order.total_price}р.</div>
            </div>
            <div className="historyOrderDetails">
              <div>Адрес: {order.address || '—'}</div>
              <div>Статус: {order.status}</div>
              <div>Дата: {new Date(order.created_at).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}