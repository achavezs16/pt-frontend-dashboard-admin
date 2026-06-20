import axios from 'axios';

const BASE_URL_ADMIN =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8086/api/v1';

export const apiAdminClient = axios.create({
  baseURL: BASE_URL_ADMIN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiAdminClient.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token') || localStorage.getItem('adminToken')
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authAdminService = {
  login: async (email: string, password: string) => {
    return apiAdminClient.post('/auth/login', { email, password });
  },
};