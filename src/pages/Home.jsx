import React from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import Button from '../components/Button/Button';
import useProducts from '../hooks/useProducts';
import './Home.css';

function Home() {
  const {
    products, loading, error, reload,
  } = useProducts();

  return (
    <section className="home">
      <div className="home__hero">
        <h1>Catalog</h1>
        <p>Products served by the ecommerce-backend REST API.</p>
      </div>

      {loading && (
        <div className="product-grid" aria-busy="true">
          {[1, 2, 3, 4].map((n) => <div key={n} className="product-skeleton" />)}
        </div>
      )}

      {!loading && error && (
        <div className="home__state" role="alert">
          <p>
            Could not load the catalog.
            {' '}
            {error}
          </p>
          <Button onClick={reload}>Try again</Button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="home__state">
          <p>No products yet. Add some from the Django admin.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
