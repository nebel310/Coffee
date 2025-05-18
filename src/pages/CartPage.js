import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';
import { getCart, updateCartItem, removeFromCart, checkoutCart } from '../api';

export default function CartPage({ token }) {
  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await getCart(token);
      setCart(cartData);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      setError('Не удалось загрузить корзину');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const handleQuantityChange = async (cartId, newQuantity) => {
    try {
      setIsLoading(true);
      await updateCartItem(cartId, newQuantity, token);
      await fetchCart();
    } catch (err) {
      console.error('Ошибка изменения количества:', err);
      setError('Не удалось изменить количество');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (cartId) => {
    try {
      setIsLoading(true);
      await removeFromCart(cartId, token);
      await fetchCart();
    } catch (err) {
      console.error('Ошибка удаления товара:', err);
      setError('Не удалось удалить товар');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError('Введите адрес доставки');
      return;
    }

    try {
      setIsLoading(true);
      await checkoutCart(address, token);
      alert('Заказ успешно оформлен!');
      setCart(null);
      setAddress('');
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      setError(err.message || 'Ошибка оформления заказа');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Для просмотра корзины войдите в аккаунт</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading && !cart) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Загрузка корзины...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mainBody">
        <Header />
        <div className="empty-message-container">
          <div className="empty-message">Корзина пуста 🧺</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mainBody">
      <Header />
      <main className="cartContainer">
        {error && <div className="error-message">{error}</div>}
        
        <div className="cartScroller">
          {cart.items.map(item => (
            <div key={item.id} className="positionContainer">
              <img 
                className="positionImg" 
                src={'/icons/default-product.png'}
                alt={item.product.title} 
              />
              <div className="positionName">
                <strong>{item.product.title}</strong>
              </div>
              <div className="positionPrice">
                <div>{item.product.price * item.quantity}р.</div>
                <small>{item.product.price} за шт.</small>
              </div>
              <div className="quantityControl">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={isLoading || item.quantity <= 1}
                >
                  −
                </button>
                <div className="qtyDisplay">{item.quantity}</div>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={isLoading}
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                disabled={isLoading}
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="buyContainer">
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Адрес доставки"
            disabled={isLoading}
          />
          <div className="totalPrice">Итого: {cart.total_price}р.</div>
          <button 
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? 'Оформление...' : 'Оформить заказ'}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}