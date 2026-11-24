import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { request } from '../../services/api';
import { formatDate, formatPrice } from '../../utils/format';
import './Orders.css';

function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/orders/').then(setOrders).catch((err) => setError(err.message));
  }, []);

  return (
    <section className="orders">
      <h1>Your orders</h1>
      {location.state?.placed && (
        <p className="orders__success" role="status">
          Order #
          {location.state.placed}
          {' '}
          placed. Thank you!
        </p>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {orders && orders.length === 0 && (
        <p className="orders__empty">
          No orders yet.
          {' '}
          <Link to="/">Start shopping</Link>
        </p>
      )}
      {orders && orders.map((order) => (
        <article key={order.id} className="order">
          <header className="order__header">
            <strong>
              Order #
              {order.id}
            </strong>
            <span>{formatDate(order.created_at)}</span>
            <span className="order__status">{order.status}</span>
            <strong className="order__total">{formatPrice(order.total)}</strong>
          </header>
          <ul>
            {order.items.map((item) => (
              <li key={`${order.id}-${item.name}`}>
                {item.quantity}
                {' × '}
                {item.name}
                <span>{formatPrice(item.unit_price)}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

export default Orders;
