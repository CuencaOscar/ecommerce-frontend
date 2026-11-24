import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import Cart from './Cart';
import { useCart } from '../../context/CartContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  // eslint-disable-next-line react/prop-types
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));
jest.mock('../../context/CartContext', () => ({ useCart: jest.fn() }));

const cart = {
  total: '224.00',
  items: [
    {
      id: 7, quantity: 2, subtotal: '179.00', product: { name: 'Keyboard', price: '89.50', stock: 5 },
    },
    {
      id: 8, quantity: 1, subtotal: '45.00', product: { name: 'USB-C Hub', price: '45.00', stock: 1 },
    },
  ],
};

test('shows an empty state', () => {
  useCart.mockReturnValue({ cart: { items: [], total: '0.00' } });
  render(<Cart />);
  expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
});

test('lists items with the total', () => {
  useCart.mockReturnValue({ cart });
  render(<Cart />);
  expect(screen.getByText('Keyboard')).toBeInTheDocument();
  expect(screen.getByText('$224.00')).toBeInTheDocument();
});

test('limits quantities to the available stock', async () => {
  const updateItem = jest.fn().mockResolvedValue();
  useCart.mockReturnValue({ cart, updateItem });
  render(<Cart />);

  const increase = screen.getAllByRole('button', { name: 'Increase' });
  expect(increase[1]).toBeDisabled();
  await act(async () => { fireEvent.click(increase[0]); });
  expect(updateItem).toHaveBeenCalledWith(7, 3);
});

test('places the order', async () => {
  const checkout = jest.fn().mockResolvedValue({ id: 12 });
  useCart.mockReturnValue({ cart, checkout });
  render(<Cart />);

  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Place order' })); });

  expect(checkout).toHaveBeenCalled();
  expect(mockNavigate).toHaveBeenCalledWith('/orders', { state: { placed: 12 } });
});
