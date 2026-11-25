/**
 * In-browser stand-in for the Django REST API, used by the static GitHub Pages demo
 * (REACT_APP_DEMO=true). It mirrors the real endpoints, status codes and response shapes
 * of ecommerce-backend and keeps its "database" in localStorage, so the demo works
 * without a server and every visitor gets an isolated store.
 */

const DB_KEY = 'shopfront.demo.v2';

export const DEMO_ACCOUNT = { email: 'demo@shopfront.dev', password: 'demo-pass-2026', name: 'Demo Customer' };

// Same catalog as `seed_products` in ecommerce-backend. Photos from Unsplash (https://unsplash.com/license).
const photo = (id) => `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&auto=format&q=80`;

const SEED_PRODUCTS = [
  ['Wireless Headphones', 'Over-ear, active noise cancelling, 30-hour battery.', '129.90', 25, 'photo-1546435770-a3e426bf472b'],
  ['Mechanical Keyboard', 'Hot-swappable switches and per-key RGB backlight.', '89.50', 40, 'photo-1589578228447-e1a4e481c6c8'],
  ['USB-C Hub', '7-in-1 with 4K HDMI and 100 W power delivery.', '45.00', 60, 'photo-1616578273577-5d54546f4dec'],
  ['Smartwatch', 'Heart-rate and GPS tracking, water resistant.', '199.00', 15, 'photo-1579586337278-3befd40fd17a'],
  ['Portable SSD 1 TB', 'USB 3.2 Gen 2, up to 1,050 MB/s.', '109.99', 0, 'photo-1577538926210-fc6cc624fde2'],
  ['Webcam 1080p', 'Autofocus, dual microphones and privacy shutter.', '59.90', 32, 'photo-1623949556303-b0d17d198863'],
  ['Wireless Mouse', 'Silent clicks, 4,000 DPI sensor and USB-C charging.', '34.90', 50, 'photo-1658070429465-848c0796abf3'],
  ['Bluetooth Speaker', 'Compact, water resistant, 12 hours of playback.', '49.00', 8, 'photo-1547052178-7f2c5a20c332'],
];

function seed() {
  const createdAt = new Date().toISOString();
  return {
    nextId: { user: 2, cartItem: 1, order: 1 },
    products: SEED_PRODUCTS.map(([name, description, price, stock, photoId], i) => ({
      id: i + 1, name, description, price, stock, image_url: photo(photoId), created_at: createdAt,
    })),
    users: [{ id: 1, ...DEMO_ACCOUNT, email: DEMO_ACCOUNT.email }],
    cartItems: [],
    orders: [],
  };
}

function load() {
  try {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    if (db?.products) return db;
  } catch {
    // Corrupt or missing data: start again from the seed.
  }
  return seed();
}

function save(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

const money = (value) => Number(value).toFixed(2);

class DemoResponse {
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}

const respond = (status, data = null) => new DemoResponse(status, data);
const userJson = ({ id, email, name }) => ({ id, email, name });
const orderJson = ({ id, status, total, created_at: createdAt, items }) => ({
  id, status, total, created_at: createdAt, items,
});

function cartPayload(db, userId) {
  const items = db.cartItems
    .filter((item) => item.userId === userId)
    .map((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      return { id: item.id, product, quantity: item.quantity, subtotal: money(product.price * item.quantity) };
    });
  const total = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
  return { items, total: money(total) };
}

function validateQuantity(product, quantity) {
  if (!Number.isInteger(quantity) || quantity < 1) return { quantity: ['Quantity must be at least 1.'] };
  if (quantity > product.stock) return { quantity: [`Only ${product.stock} units of ${product.name} left.`] };
  return null;
}

function register(db, { name, email, password } = {}) {
  const errors = {};
  const normalized = (email || '').trim().toLowerCase();
  if (!name?.trim()) errors.name = ['This field may not be blank.'];
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) errors.email = ['Enter a valid email address.'];
  else if (db.users.some((u) => u.email === normalized)) errors.email = ['An account with this email already exists.'];
  if (!password || password.length < 8) errors.password = ['Ensure this field has at least 8 characters.'];
  else if (/^\d+$/.test(password)) errors.password = ['This password is entirely numeric.'];
  if (Object.keys(errors).length) return respond(400, errors);

  const user = { id: db.nextId.user, name: name.trim(), email: normalized, password };
  db.nextId.user += 1;
  db.users.push(user);
  return respond(201, { user: userJson(user), ...tokensFor(user) });
}

function tokensFor(user) {
  return { access: `demo-access.${user.id}`, refresh: `demo-refresh.${user.id}` };
}

function userFromToken(db, token, kind) {
  const match = new RegExp(`^demo-${kind}\\.(\\d+)$`).exec(token || '');
  return match ? db.users.find((u) => u.id === Number(match[1])) : undefined;
}

function checkout(db, user) {
  const items = db.cartItems.filter((item) => item.userId === user.id);
  if (!items.length) return respond(400, { detail: 'Your cart is empty.' });
  const lines = items.map((item) => ({ item, product: db.products.find((p) => p.id === item.productId) }));
  const missing = lines.filter(({ item, product }) => product.stock < item.quantity).map(({ product }) => product.name);
  if (missing.length) return respond(409, { detail: `Not enough stock for: ${missing.join(', ')}.` });

  const order = {
    id: db.nextId.order,
    userId: user.id,
    status: 'placed',
    created_at: new Date().toISOString(),
    items: lines.map(({ item, product }) => ({
      product: product.id, name: product.name, unit_price: product.price, quantity: item.quantity,
    })),
  };
  order.total = money(order.items.reduce((sum, line) => sum + line.unit_price * line.quantity, 0));
  db.nextId.order += 1;
  lines.forEach(({ item, product }) => { product.stock -= item.quantity; });
  db.cartItems = db.cartItems.filter((item) => item.userId !== user.id);
  db.orders.unshift(order);
  return respond(201, orderJson(order));
}

/** Route one request; mutates `db` in place. */
function route(db, path, method, body, authHeader) {
  const user = userFromToken(db, authHeader, 'access');
  const needsUser = () => (user ? null : respond(401, { detail: 'Authentication credentials were not provided.' }));

  if (path === '/products/' && method === 'GET') return respond(200, db.products);
  const productMatch = /^\/products\/(\d+)\/$/.exec(path);
  if (productMatch && method === 'GET') {
    const product = db.products.find((p) => p.id === Number(productMatch[1]));
    return product ? respond(200, product) : respond(404, { detail: 'Not found.' });
  }

  if (path === '/auth/register/' && method === 'POST') return register(db, body);
  if (path === '/auth/token/' && method === 'POST') {
    const found = db.users.find((u) => u.email === (body?.username || '').trim().toLowerCase());
    if (!found || found.password !== body?.password) {
      return respond(401, { detail: 'No active account found with the given credentials' });
    }
    return respond(200, tokensFor(found));
  }
  if (path === '/auth/token/refresh/' && method === 'POST') {
    const found = userFromToken(db, body?.refresh, 'refresh');
    return found ? respond(200, { access: tokensFor(found).access }) : respond(401, { detail: 'Token is invalid or expired' });
  }
  if (path === '/auth/me/' && method === 'GET') return needsUser() || respond(200, userJson(user));

  if (path === '/cart/' && method === 'GET') return needsUser() || respond(200, cartPayload(db, user.id));
  if (path === '/cart/items/' && method === 'POST') {
    if (!user) return needsUser();
    const product = db.products.find((p) => p.id === Number(body?.product_id));
    if (!product) return respond(404, { detail: 'Not found.' });
    const existing = db.cartItems.find((i) => i.userId === user.id && i.productId === product.id);
    const quantity = Number(body?.quantity ?? 1) + (existing ? existing.quantity : 0);
    const errors = validateQuantity(product, quantity);
    if (errors) return respond(400, errors);
    if (existing) existing.quantity = quantity;
    else {
      db.cartItems.push({ id: db.nextId.cartItem, userId: user.id, productId: product.id, quantity });
      db.nextId.cartItem += 1;
    }
    return respond(201, cartPayload(db, user.id));
  }
  const itemMatch = /^\/cart\/items\/(\d+)\/$/.exec(path);
  if (itemMatch && (method === 'PATCH' || method === 'DELETE')) {
    if (!user) return needsUser();
    const item = db.cartItems.find((i) => i.id === Number(itemMatch[1]) && i.userId === user.id);
    if (!item) return respond(404, { detail: 'Not found.' });
    if (method === 'DELETE') {
      db.cartItems = db.cartItems.filter((i) => i !== item);
    } else {
      const product = db.products.find((p) => p.id === item.productId);
      const errors = validateQuantity(product, Number(body?.quantity));
      if (errors) return respond(400, errors);
      item.quantity = Number(body.quantity);
    }
    return respond(200, cartPayload(db, user.id));
  }

  if (path === '/orders/' && method === 'GET') {
    return needsUser() || respond(200, db.orders.filter((o) => o.userId === user.id).map(orderJson));
  }
  if (path === '/orders/' && method === 'POST') return needsUser() || checkout(db, user);

  return respond(404, { detail: 'Not found.' });
}

/** Same contract as fetch(): resolves to { ok, status, json() }. */
export default async function demoFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const db = load();
  const token = (headers.Authorization || '').replace(/^Bearer /, '');
  const { status, data } = route(db, path, method, body === undefined ? undefined : JSON.parse(body), token);
  save(db);
  // A short delay keeps loading states visible, like a real network round trip.
  await new Promise((resolve) => { setTimeout(resolve, 120); });
  return { ok: status >= 200 && status < 300, status, json: async () => data };
}
