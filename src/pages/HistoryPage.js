import React from 'react';
import '../App.css';
import Header from '../components/header';
import Footer from '../components/footer';

export default function HistoryPage() {
  const orders = [
    {
      id: 1,
      items: [
        { name: 'Латте', image: '/menu/1.png', quantity: 1 },
        { name: 'Чай', image: '/menu/3.png', quantity: 2 },
      ],
      total: 350,
      address: 'aASDaSdsadsad',
      datetime: '2025-04-08 14:49:33',
    },
    {
      id: 2,
      items: [
        { name: 'Латте', image: '/menu/1.png', quantity: 1 },
        { name: 'Картошка', image: '/menu/2.png', quantity: 1 },
      ],
      total: 350,
      address: '',
      datetime: '2025-02-03 19:37:16',
    },
  ];

  return (
    <div className="mainBody">
      <Header />

      <main className="historyContainer">
        {orders.map((order) => (
          <div className="historyPositionContainer" key={order.id}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ position: 'relative', marginRight: '10px' }}>
                  <img src={item.image} alt={item.name} className="historyPositionImg" />
                  <span
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      fontSize: '14px',
                      backgroundColor: 'rgb(214, 187, 135)',
                      borderRadius: '50%',
                      padding: '2px 6px',
                    }}
                  >
                    x{item.quantity}
                  </span>
                </div>
              ))}
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                = {order.total}р.
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div>Адрес: {order.address || '—'}</div>
              <div>От: {order.datetime}</div>
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}