import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './SignIn.css';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await signIn(formData.email, formData.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.status === 401 ? 'Wrong email or password.' : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit">{submitting ? 'Signing in…' : 'Sign in'}</Button>
        <p className="form-note">
          New here?
          {' '}
          <Link to="/sign-up">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
