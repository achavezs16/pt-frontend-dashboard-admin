import axios from 'axios';

// Tu propia URL apuntando al puerto real del Gateway
const BASE_URL_ADMIN = 'http://localhost:8086/api/v1';

export const apiAdminClient = axios.create({
  baseURL: BASE_URL_ADMIN,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio exclusivo para tu Login de Administrador
export const authAdminService = {
  login: async (email: string, password: string) => {
    // Esto asegura que le pegas exactamente a http://localhost:8086/api/v1/auth/login
    return apiAdminClient.post('/auth/login', { email, password });
  }
};