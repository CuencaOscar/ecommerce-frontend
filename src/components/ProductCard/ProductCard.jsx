import React from 'react';
import PropTypes from 'prop-types';
import './ProductCard.css';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function ProductCard({ product }) {
  const inStock = product.stock > 0;
  return (
    <article className="product-card">
      <div className="product-card__thumb" aria-hidden="true">
        {product.name.charAt(0)}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{currency.format(Number(product.price))}</span>
          <span className={`product-card__stock ${inStock ? 'is-available' : 'is-out'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
