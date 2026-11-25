import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate, useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { IS_DEMO } from './services/api';
import { BagIcon, MoonIcon, SunIcon } from './components/Icons';
import Home from './pages/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp';
import Cart from './pages/Cart/Cart';
import Orders from './pages/Orders/Orders';
import './App.css';

/** Routes that need a signed-in user redirect to the sign-in page and come back afterwards. */
function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  return children;
}

RequireAuth.propTypes = { children: PropTypes.node.isRequired };

function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { count } = useCart();

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand__mark"><BagIcon size={18} /></span>
        Shopfront
      </Link>
      <nav>
        <NavLink to="/" end>Catalog</NavLink>
        {user ? (
          <>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/cart" className="nav-cart">
              <BagIcon size={18} />
              Cart
              {count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
            <span className="nav-user">{user.name}</span>
            <button type="button" className="nav-link-button" onClick={signOut}>Sign out</button>
          </>
        ) : (
          <>
            <NavLink to="/sign-in">Sign in</NavLink>
            <NavLink to="/sign-up" className="nav-cta">Create account</NavLink>
          </>
        )}
      </nav>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
      </button>
    </header>
  );
}

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className={`App ${theme}`}>
        {IS_DEMO && (
          <p className="demo-banner">
            Live demo: the API runs in your browser and data is saved only on this device.
            {' '}
            <a href="https://github.com/CuencaOscar/ecommerce-backend">See the Django backend</a>
          </p>
        )}
        <TopBar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
            <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          </Routes>
        </main>
        <footer className="site-footer">
          Shopfront · React front end for the
          {' '}
          <a href="https://github.com/CuencaOscar/ecommerce-backend">Django REST backend</a>
          {' · '}
          Product photos from
          {' '}
          <a href="https://unsplash.com">Unsplash</a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
