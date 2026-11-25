import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import ProductImage from '../../components/ProductImage';
import { BagIcon } from '../../components/Icons';
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
        <span className="cart__empty-icon"><BagIcon size={28} /></span>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link className="cart__browse" to="/">Browse the catalog</Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1>Your cart</h1>
      <div className="cart__layout">
        <ul className="cart__list">
          {cart.items.map((item) => (
            <li key={item.id} className="cart__item">
              <ProductImage src={item.product.image_url} name={item.product.name} className="cart__thumb" />
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
        <aside className="cart__summary">
          <h2>Order summary</h2>
          <dl>
            <div>
              <dt>Items</dt>
              <dd>{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</dd>
            </div>
            <div className="cart__total">
              <dt>Total</dt>
              <dd>{formatPrice(cart.total)}</dd>
            </div>
          </dl>
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button onClick={handleCheckout}>{placing ? 'Placing order…' : 'Place order'}</Button>
          <Link className="cart__continue" to="/">Continue shopping</Link>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
