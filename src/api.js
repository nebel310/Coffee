const API_URL = 'http://localhost:5000';
const IMAGE_BASE_URL = 'http://localhost:5000';

async function request(url, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  // Для GET запросов добавляем параметры в URL
  if (method === 'GET' && data) {
    const params = new URLSearchParams();
    for (const key in data) {
      params.append(key, data[key]);
    }
    url += `?${params.toString()}`;
  }
  // Для других методов добавляем тело запроса
  else if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${url}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.detail || 'Ошибка сервера');
    }

    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth
export const login = (data) => request('/auth/login', 'POST', data);
export const register = (data) => request('/auth/register', 'POST', data);
export const getCurrentUser = (token) => request('/auth/me', 'GET', null, token);
export const logout = (token) => request('/auth/logout', 'POST', null, token);

// Products
export const getProducts = async () => {
  const products = await request('/products/');
  return products.map(product => ({
    ...product,
    image_path: `${IMAGE_BASE_URL}${product.image_path}`
  }));
};
export const getProductById = (id) => request(`/products/${id}`);

// Cart
export const getCart = async (token) => {
  const cartData = await request('/cart/', 'GET', null, token);
  
  // Преобразуем структуру данных для фронтенда
  return {
    items: cartData.items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        title: item.product?.title || 'Неизвестный товар',
        price: item.product?.price || 0,
        image_path: item.product?.image_path || '/icons/default-product.png'
      }
    })),
    total_price: cartData.total_price
  };
};

// Исправленные методы для работы с корзиной:
export const addToCart = (productId, quantity, token) => {
  const params = new URLSearchParams();
  params.append('product_id', productId);
  params.append('quantity', quantity);
  return request(`/cart/add?${params.toString()}`, 'POST', null, token);
};

export const updateCartItem = (cartId, quantity, token) => {
  if (!cartId) throw new Error('Invalid cart item ID');
  return request(`/cart/${cartId}?quantity=${quantity}`, 'PATCH', null, token);
};

export const removeFromCart = (cartId, token) => {
  if (!cartId) throw new Error('Invalid cart item ID');
  return request(`/cart/${cartId}`, 'DELETE', null, token);
};

export const checkoutCart = (address, token) => {
  const params = new URLSearchParams();
  params.append('address', address);
  return request(`/cart/checkout?${params.toString()}`, 'POST', null, token);
};

// Orders
export const getUserOrders = (token) => request('/orders/', 'GET', null, token);
export const getOrderDetails = (orderId, token) => request(`/orders/${orderId}`, 'GET', null, token);