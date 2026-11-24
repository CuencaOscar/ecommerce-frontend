import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { request } from '../services/api';
import { useAuth } from './AuthContext';

const EMPTY_CART = { items: [], total: '0.00' };
const CartContext = createContext(null);

/** Server-side cart of the signed-in user. */
export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY_CART);

  useEffect(() => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }
    request('/cart/').then(setCart).catch(() => setCart(EMPTY_CART));
  }, [user]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    setCart(await request('/cart/items/', { method: 'POST', body: { product_id: productId, quantity } }));
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    setCart(await request(`/cart/items/${itemId}/`, { method: 'PATCH', body: { quantity } }));
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setCart(await request(`/cart/items/${itemId}/`, { method: 'DELETE' }));
  }, []);

  const checkout = useCallback(async () => {
    const order = await request('/orders/', { method: 'POST' });
    setCart(EMPTY_CART);
    return order;
  }, []);

  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(() => ({
    cart, count, addItem, updateItem, removeItem, checkout,
  }), [cart, count, addItem, updateItem, removeItem, checkout]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = { children: PropTypes.node.isRequired };

export const useCart = () => useContext(CartContext);
