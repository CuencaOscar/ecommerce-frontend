import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import ProductImage from '../components/ProductImage';
import Button from '../components/Button/Button';
import {
  ArrowRightIcon, BoxIcon, ReceiptIcon, ShieldIcon,
} from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import useProducts from '../hooks/useProducts';
import './Home.css';

const HIGHLIGHTS = [
  { icon: ShieldIcon, title: 'Secure accounts', text: 'JWT sign-in with silent token refresh.' },
  { icon: BoxIcon, title: 'Live stock', text: 'Quantities checked against the inventory.' },
  { icon: ReceiptIcon, title: 'Order history', text: 'Every checkout saved to your account.' },
];

function Home() {
  const {
    products, loading, error, reload,
  } = useProducts();
  const { user } = useAuth();
  // Hero collage built from in-stock products that have a photo.
  const [featured, second, , fourth] = products.filter((p) => p.image_url && p.stock > 0);
  const thumbs = [fourth, second].filter(Boolean);

  return (
    <section className="home">
      <div className="hero">
        <div className="hero__copy">
          <span className="hero__eyebrow">New season · Desk setup</span>
          <h1>Tech essentials for work and play.</h1>
          <p>
            Headphones, keyboards and accessories picked for your desk. Sign in, fill your cart and
            check out in a few clicks.
          </p>
          <div className="hero__actions">
            <a className="hero__primary" href="#catalog">
              Shop the catalog
              <ArrowRightIcon size={18} />
            </a>
            {user
              ? <Link className="hero__secondary" to="/orders">Your orders</Link>
              : <Link className="hero__secondary" to="/sign-up">Create an account</Link>}
          </div>
        </div>
        <div className="hero__gallery" aria-hidden="true">
          {featured && (
            <ProductImage src={featured.image_url} name={featured.name} className="hero__main" />
          )}
          {thumbs.map((p) => (
            <ProductImage key={p.id} src={p.image_url} name={p.name} className="hero__thumb" />
          ))}
        </div>
      </div>

      <ul className="highlights">
        {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <span className="highlights__icon"><Icon size={20} /></span>
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="section-header" id="catalog">
        <div>
          <h2>Catalog</h2>
          <p>Products served by the ecommerce-backend REST API.</p>
        </div>
        {!loading && !error && products.length > 0 && (
          <span className="section-header__count">
            {products.length}
            {' '}
            products
          </span>
        )}
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
