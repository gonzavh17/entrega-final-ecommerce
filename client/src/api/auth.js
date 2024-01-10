import axios from 'axios'

const API = 'http://localhost:8080/api'

export const registerRequest = user => axios.post(`${API}/session/register`, user)
export const loginRequest = user => axios.post(`${API}/session/login`, user)
export const getProducts = products => axios.get(`${API}/products`, products)
export const getProductsById = (product_id, products) => axios.get(`${API}/products/${product_id}`, products)
export const removeProduct = (product_id, cart_id) => axios.delete(`${API}/carts/${cart_id}/products/${product_id}`); //chequear
export const clearCartRequest = (cart_id) => axios.delete ((`${API}/carts/${cart_id}/clear`))
export const createProduct = (product) => axios.post(`${API}/products`, product)
export const deleteProductFromCart = async (cart_id, product_id) => {
  try {
    const response = await axios.post(`${API}/carts/${cart_id}/products/${product_id}/deleteProduct`);
    console.log('Deletion response:', response.data);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};
export const purchaseCart = (cart_id) => axios.post((`${API}/carts/pruchase/${cart_id}`))
export const postProductIntoCart = (cart_id, product_id, quantity) => {
  const data = { cid: cart_id, pid: product_id, quantity }; // Añade quantity aquí
  const url = `${API}/carts/${cart_id}/products/${product_id}`;

  console.log('URL de la solicitud:', url); // Agrega esto para depurar

  return axios.post(url, data);
};

export const getTickets = () => axios.get (`${API}/tickets`)