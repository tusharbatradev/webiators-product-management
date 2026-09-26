import api from './api';

export const signup = (credentials) =>
  api.post('/auth/signup', credentials).then((res) => res.data);

export const login = (credentials) =>
  api.post('/auth/login', credentials).then((res) => res.data);

export const getCurrentUser = () =>
  api.get('/auth/me').then((res) => res.data);
