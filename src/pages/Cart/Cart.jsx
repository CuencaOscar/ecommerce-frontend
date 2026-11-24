import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import './Cart.css';

function Cart() {
  const {
    cart, updateItem, removeItem, checkout,
  } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const run = async (action) => {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    setPlacing(true);
    await run(async () => {
      const order = await checkout();
      navigate('/orders', { state: { placed: order.id } });
    });
    setPlacing(false);
  };

  if (cart.items.length === 0) {
    return (
      <section className="cart cart--empty">
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse the catalog</Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1>Your cart</h1>
      <ul className="cart__list">
        {cart.items.map((item) => (
          <li key={item.id} className="cart__item">
            <div className="cart__thumb" aria-hidden="true">{item.product.name.charAt(0)}</div>
            <div className="cart__info">
              <strong>{item.product.name}</strong>
              <span>{formatPrice(item.product.price)}</span>
            </div>
            <div className="cart__qty">
              <button type="button" aria-label="Decrease" disabled={item.quantity <= 1} onClick={() => run(() => updateItem(item.id, item.quantity - 1))}>−</button>
              <span>{item.quantity}</span>
              <button type="button" aria-label="Increase" disabled={item.quantity >= item.product.stock} onClick={() => run(() => updateItem(item.id, item.quantity + 1))}>+</button>
            </div>
            <span className="cart__subtotal">{formatPrice(item.subtotal)}</span>
            <button type="button" className="cart__remove" onClick={() => run(() => removeItem(item.id))}>Remove</button>
          </li>
        ))}
      </ul>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="cart__summary">
        <span>Total</span>
        <strong>{formatPrice(cart.total)}</strong>
        <Button onClick={handleCheckout}>{placing ? 'Placing order…' : 'Place order'}</Button>
      </div>
    </section>
  );
}

export default Cart;
