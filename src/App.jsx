import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, NavLink, Link, Navigate, useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
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
      <Link to="/" className="brand">Shopfront</Link>
      <nav>
        <NavLink to="/" end>Catalog</NavLink>
        {user ? (
          <>
            <NavLink to="/orders">Orders</NavLink>
            <NavLink to="/cart" className="nav-cart">
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
        {theme === 'dark' ? '☀' : '☾'}
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
    <Router>
      <div className={`App ${theme}`}>
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
      </div>
    </Router>
  );
}

export default App;
