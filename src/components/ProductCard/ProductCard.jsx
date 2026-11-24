import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import './ProductCard.css';

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const inStock = product.stock > 0;

  const handleAdd = async () => {
    if (!user) {
      navigate('/sign-in', { state: { from: '/' } });
      return;
    }
    setStatus('adding');
    setError('');
    try {
      await addItem(product.id);
      setStatus('added');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <article className="product-card">
      <div className="product-card__thumb" aria-hidden="true">
        {product.name.charAt(0)}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <span className={`product-card__stock ${inStock ? 'is-available' : 'is-out'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          type="button"
          className="product-card__add"
          onClick={handleAdd}
          disabled={!inStock || status === 'adding'}
        >
          {status === 'added' ? 'Added ✓' : 'Add to cart'}
        </button>
        {error && <p className="product-card__error" role="alert">{error}</p>}
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
