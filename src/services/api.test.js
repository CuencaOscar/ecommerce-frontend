import { ApiError, request, tokenStore } from './api';

const json = (status, body) => Promise.resolve({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body),
});

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn();
});

test('sends the access token when the user is signed in', async () => {
  tokenStore.set({ access: 'abc', refresh: 'r1' });
  global.fetch.mockReturnValueOnce(json(200, { items: [] }));

  await request('/cart/');

  expect(global.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
});

test('refreshes an expired token and retries the request once', async () => {
  tokenStore.set({ access: 'old', refresh: 'r1' });
  global.fetch
    .mockReturnValueOnce(json(401, { detail: 'expired' }))
    .mockReturnValueOnce(json(200, { access: 'new' }))
    .mockReturnValueOnce(json(200, { ok: true }));

  const data = await request('/cart/');

  expect(data).toEqual({ ok: true });
  expect(tokenStore.get().access).toBe('new');
  expect(global.fetch.mock.calls[2][1].headers.Authorization).toBe('Bearer new');
});

test('turns API errors into readable messages', async () => {
  global.fetch.mockReturnValueOnce(json(400, { quantity: ['Only 2 units left.'] }));

  await expect(request('/cart/items/', { method: 'POST', body: {} })).rejects.toEqual(
    new ApiError('Only 2 units left.', 400),
  );
});
