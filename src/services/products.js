import { request } from './api';

/** Public product catalog. */
export function fetchProducts() {
  return request('/products/', { auth: false });
}

export default fetchProducts;
