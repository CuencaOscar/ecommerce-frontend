import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import ProductCard from './ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));
jest.mock('../../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../../context/CartContext', () => ({ useCart: jest.fn() }));

const product = {
  id: 1, name: 'USB-C Hub', description: '7-in-1', price: '45.00', stock: 3,
};

beforeEach(() => {
  mockNavigate.mockReset();
});

test('shows price and stock', () => {
  useAuth.mockReturnValue({ user: null });
  useCart.mockReturnValue({ addItem: jest.fn() });
  render(<ProductCard product={product} />);

  expect(screen.getByText('USB-C Hub')).toBeInTheDocument();
  expect(screen.getByText('$45.00')).toBeInTheDocument();
  expect(screen.getByText('3 in stock')).toBeInTheDocument();
});

test('sends anonymous visitors to sign in', () => {
  useAuth.mockReturnValue({ user: null });
  useCart.mockReturnValue({ addItem: jest.fn() });
  render(<ProductCard product={product} />);

  fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

  expect(mockNavigate).toHaveBeenCalledWith('/sign-in', { state: { from: '/' } });
});

test('adds the product for signed-in users', async () => {
  const addItem = jest.fn().mockResolvedValue();
  useAuth.mockReturnValue({ user: { name: 'Ana' } });
  useCart.mockReturnValue({ addItem });
  render(<ProductCard product={product} />);

  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Add to cart' })); });

  expect(addItem).toHaveBeenCalledWith(1);
  expect(screen.getByRole('button', { name: 'Added ✓' })).toBeInTheDocument();
});

test('disables the button when the product is out of stock', () => {
  useAuth.mockReturnValue({ user: { name: 'Ana' } });
  useCart.mockReturnValue({ addItem: jest.fn() });
  render(<ProductCard product={{ ...product, stock: 0 }} />);

  expect(screen.getByText('Out of stock')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add to cart' })).toBeDisabled();
});
