import demoFetch from './demoApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/** The GitHub Pages build runs against an in-browser copy of the API (see demoApi.js). */
export const IS_DEMO = process.env.REACT_APP_DEMO === 'true';

const http = (path, init) => (IS_DEMO ? demoFetch(path, init) : fetch(`${API_URL}${path}`, init));
const TOKENS_KEY = 'shopfront.tokens';

export const tokenStore = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(TOKENS_KEY));
    } catch {
      return null;
    }
  },
  set(tokens) {
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  },
  clear() {
    localStorage.removeItem(TOKENS_KEY);
  },
};

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/** Turn a DRF error body into one readable sentence. */
function messageFrom(data, status) {
  if (!data) return `Request failed (${status}).`;
  if (typeof data.detail === 'string') return data.detail;
  const first = Object.values(data)[0];
  if (Array.isArray(first)) return first[0];
  if (typeof first === 'string') return first;
  return `Request failed (${status}).`;
}

async function refreshAccessToken() {
  const tokens = tokenStore.get();
  if (!tokens?.refresh) return null;
  const response = await http('/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!response.ok) {
    tokenStore.clear();
    return null;
  }
  const { access } = await response.json();
  tokenStore.set({ ...tokens, access });
  return access;
}

/**
 * JSON request against the API. Sends the access token when there is one and
 * retries once with a refreshed token if it has expired.
 */
export async function request(path, { method = 'GET', body, auth = true } = {}, retried = false) {
  const headers = { 'Content-Type': 'application/json' };
  const access = auth ? tokenStore.get()?.access : null;
  if (access) headers.Authorization = `Bearer ${access}`;

  const response = await http(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && auth && !retried && (await refreshAccessToken())) {
    return request(path, { method, body, auth }, true);
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(messageFrom(data, response.status), response.status, data);
  return data;
}
