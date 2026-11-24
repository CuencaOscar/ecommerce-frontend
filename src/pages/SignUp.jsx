import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn/SignIn.css';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';

const MIN_PASSWORD_LENGTH = 8;

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < MIN_PASSWORD_LENGTH) {
      setError(`The password needs at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await signUp(formData);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signin-container">
      <h1>Create account</h1>
      <form onSubmit={handleSubmit} className="signin-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={formData.name} onChange={handleChange} autoComplete="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button type="submit">{submitting ? 'Creating account…' : 'Create account'}</Button>
        <p className="form-note">
          Already have an account?
          {' '}
          <Link to="/sign-in">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
