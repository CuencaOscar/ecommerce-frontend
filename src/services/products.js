const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Fetch the product catalog from the ecommerce-backend REST API.
 * @returns {Promise<Array<{id:number,name:string,description:string,price:string,stock:number}>>}
 */
export async function fetchProducts() {
  const response = await fetch(`${API_URL}/products/`);
  if (!response.ok) {
    throw new Error(`The server answered with status ${response.status}.`);
  }
  return response.json();
}

export default fetchProducts;
