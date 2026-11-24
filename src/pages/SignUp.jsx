import React, { useState } from 'react';
import './SignIn/SignIn.css';
import Button from '../components/Button/Button';

const MIN_PASSWORD_LENGTH = 8;

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
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
    // Registration will call the accounts endpoint once it exists in ecommerce-backend.
    setSubmitted(true);
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
        <Button type="submit">Create account</Button>
        {submitted && (
          <p className="form-note" role="status">
            Accounts are not connected yet: the backend currently exposes the catalog only.
          </p>
        )}
      </form>
    </div>
  );
}

export default SignUp;
