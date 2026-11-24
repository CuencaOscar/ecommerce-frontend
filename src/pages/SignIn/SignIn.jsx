import React, { useState } from 'react';
import './SignIn.css';
import Button from '../../components/Button/Button';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication will call the accounts endpoint once it exists in ecommerce-backend.
    setSubmitted(true);
  };

  return (
    <div className="signin-container">
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit} className="signin-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
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
            value={password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit">Sign In</Button>
        {submitted && (
          <p className="form-note" role="status">
            Accounts are not connected yet: the backend currently exposes the catalog only.
          </p>
        )}
      </form>
    </div>
  );
}

export default SignIn;
