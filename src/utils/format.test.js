import { formatPrice } from './format';

test('formats prices as US dollars', () => {
  expect(formatPrice('129.9')).toBe('$129.90');
  expect(formatPrice(1050)).toBe('$1,050.00');
});
