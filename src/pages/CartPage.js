import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';

export default function CartPage() {
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Кофе Латте',
      image: '/menu/1.png',
      price: 250,
      unit: 250,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Картошка фри',
      image: '/menu/3.png',
      price: 100,
      unit: 50,
      quantity: 2,
    },
  ]);

  const [address, setAddress] = useState('');

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1, price: item.unit * (item.quantity + 1) }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, price: item.unit * (item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleOrder = () => {
    if (!address.trim()) return alert('Введите адрес доставки!');
    alert(`Заказ оформлен на сумму ${totalPrice}р.\nАдрес: ${address}`);
    // здесь можно отправить данные на сервер
  };

  return (
    <div className="mainBody">
      <Header />

      <main className="cartContainer">
        <div className="cartScroller">
          {cart.length === 0 ? (
           <div className="emptyCartMessage">Корзина пуста 🧺</div>

          ) : (
            cart.map((item) => (
              <div key={item.id} className="positionContainer">
                <img className="positionImg" src={item.image} alt={item.name} />
                <div className="positionName">
                  <strong>{item.name}</strong>
                </div>
                <div className="positionPrice">
                  <div>{item.price}р.</div>
                  <small>{item.unit} за шт.</small>
                </div>
                <div className="quantityControl">
                    <button className="qtyBtn" onClick={() => decreaseQty(item.id)}>−</button>
                    <div className="qtyDisplay">{item.quantity}</div>
                    <button className="qtyBtn" onClick={() => increaseQty(item.id)}>+</button>
                    </div>
                <button className="removeButton" onClick={() => removeItem(item.id)}>❌</button>
              </div>
            ))
          )}
        </div>

        <div className="buyContainer">
          <button className="buyButton" onClick={handleOrder}>Заказать</button>
          <input
            className="buyAddress"
            placeholder="Адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="buyPrice">{totalPrice}р.</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
