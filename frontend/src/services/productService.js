import api from './api';

export const getProducts = () =>
  api.get('/products').then((res) => res.data);

export const getProductById = (id) =>
  api.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (productData) =>
  api.post('/products', productData).then((res) => res.data);

export const updateProduct = (id, productData) =>
  api.put(`/products/${id}`, productData).then((res) => res.data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((res) => res.data);
