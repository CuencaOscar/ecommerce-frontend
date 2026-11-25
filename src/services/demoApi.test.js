import demoFetch, { DEMO_ACCOUNT } from './demoApi';

async function call(path, { method = 'GET', body, token } = {}) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await demoFetch(path, { method, headers, body: body && JSON.stringify(body) });
  return { status: response.status, data: await response.json() };
}

async function signInDemo() {
  const { data } = await call('/auth/token/', {
    method: 'POST', body: { username: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password },
  });
  return data.access;
}

beforeEach(() => localStorage.clear());

test('serves the seeded catalog without authentication', async () => {
  const { status, data } = await call('/products/');
  expect(status).toBe(200);
  expect(data).toHaveLength(8);
  expect(data.every((p) => p.image_url.startsWith('https://images.unsplash.com/'))).toBe(true);
  expect(data[0]).toMatchObject({ id: 1, name: 'Wireless Headphones', price: '129.90' });
});

test('registers a customer, rejects duplicates and weak passwords', async () => {
  const created = await call('/auth/register/', {
    method: 'POST', body: { name: 'Ana', email: 'Ana@Example.com', password: 's3cure-pass!' },
  });
  expect(created.status).toBe(201);
  expect(created.data.user).toEqual({ id: 2, email: 'ana@example.com', name: 'Ana' });

  const duplicate = await call('/auth/register/', {
    method: 'POST', body: { name: 'Ana', email: 'ana@example.com', password: '12345678' },
  });
  expect(duplicate.status).toBe(400);
  expect(duplicate.data.email).toBeDefined();
  expect(duplicate.data.password).toBeDefined();
});

test('protected endpoints require a token and wrong credentials get 401', async () => {
  expect((await call('/cart/')).status).toBe(401);
  const wrong = await call('/auth/token/', { method: 'POST', body: { username: DEMO_ACCOUNT.email, password: 'nope' } });
  expect(wrong.status).toBe(401);
});

test('cart validates stock and checkout creates an order and updates stock', async () => {
  const token = await signInDemo();

  const outOfStock = await call('/cart/items/', { method: 'POST', token, body: { product_id: 5, quantity: 1 } });
  expect(outOfStock.status).toBe(400);

  const added = await call('/cart/items/', { method: 'POST', token, body: { product_id: 2, quantity: 2 } });
  expect(added.status).toBe(201);
  expect(added.data.total).toBe('179.00');

  const itemId = added.data.items[0].id;
  const updated = await call(`/cart/items/${itemId}/`, { method: 'PATCH', token, body: { quantity: 3 } });
  expect(updated.data.total).toBe('268.50');

  const order = await call('/orders/', { method: 'POST', token });
  expect(order.status).toBe(201);
  expect(order.data).toMatchObject({ status: 'placed', total: '268.50' });
  expect((await call('/cart/', { token })).data.items).toEqual([]);
  expect((await call('/products/2/')).data.stock).toBe(37);
  expect((await call('/orders/', { token })).data).toHaveLength(1);
});

test('checking out an empty cart is a 400', async () => {
  const token = await signInDemo();
  const { status, data } = await call('/orders/', { method: 'POST', token });
  expect(status).toBe(400);
  expect(data.detail).toBe('Your cart is empty.');
});
