import axios from 'axios'

const API = 'http://localhost:8080/api'

export const registerRequest = user => axios.post(`${API}/session/register`, user)
export const loginRequest = user => axios.post(`${API}/session/login`, user)
export const getProducts = products => axios.get(`${API}/products`, products)
export const getProductsById = (product_id, products) => axios.get(`${API}/products/${product_id}`, products)
export const removeProduct = (product_id, cart_id) => axios.delete(`${API}/carts/${cart_id}/products/${product_id}`); //chequear
export const clearCartRequest = (cart_id) => axios.delete ((`${API}/carts/${cart_id}/clear`))
export const postProductIntoCart = (cart_id, product_id) => {
    const data = { cid: cart_id, pid: product_id };
    const url = `${API}/carts/${cart_id}/products/${product_id}`;
  
    console.log('URL de la solicitud:', url); // Agrega esto para depurar
  
    return axios.post(url, data);
  };