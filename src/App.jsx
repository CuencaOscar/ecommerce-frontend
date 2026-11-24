import React, { useEffect } from 'react';
import {
  BrowserRouter as Router, Routes, Route, NavLink, Link,
} from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn/SignIn';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <Router>
      <div className={`App ${theme}`}>
        <header className="topbar">
          <Link to="/" className="brand">Shopfront</Link>
          <nav>
            <NavLink to="/" end>Catalog</NavLink>
            <NavLink to="/sign-in">Sign in</NavLink>
            <NavLink to="/sign-up" className="nav-cta">Create account</NavLink>
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
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
