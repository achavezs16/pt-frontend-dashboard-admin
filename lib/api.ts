// Cliente API para comunicarse con los microservicios backend
// Usando axios con TypeScript

import { ApiError, PaginatedResponse } from '@/types';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuración base de axios - Conectar directamente a microservicios específicos
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8086/api/v1';

// URLs base para cada microservicio
const MS_PEDIDOS_URL = API_BASE_URL;
const MS_PRODUCTOS_URL = API_BASE_URL;
const MS_USER_URL = API_BASE_URL;
const BFF_URL = API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token JWT automáticamente
    this.client.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error: any) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response: any) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
      },
      (error: any) => {
        console.error('API Error:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        
        // Manejar 401 Unauthorized - token expirado
        if (error.response?.status === 401) {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('refreshToken');
          // Redirigir a login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        
        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'Error desconocido',
          status: error.response?.status || 500,
          details: error.response?.data?.details,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.client.put(url, data);
  }

  async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.client.delete(url);
  }

  // Métodos específicos para pedidos - Conectando directamente a ms-pedidos
  async getPedidosByPyme(pymeId: number): Promise<AxiosResponse<any[]>> {
    const response = await axios.get(`${MS_PEDIDOS_URL}/pedidos/pyme/${pymeId}`);
    return response;
  }

  async getPedidos(params?: any): Promise<AxiosResponse<PaginatedResponse<any>>> {
    const response = await axios.get(`${MS_PEDIDOS_URL}/pedidos`, { params });
    return response;
  }

  async getPedido(id: number): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${MS_PEDIDOS_URL}/pedidos/${id}`);
    return response;
  }

  async crearPedido(data: any): Promise<AxiosResponse<any>> {
    const response = await axios.post(`${MS_PEDIDOS_URL}/pedidos`, data);
    return response;
  }

  async actualizarPedido(id: number, data: any): Promise<AxiosResponse<any>> {
    const response = await axios.put(`${MS_PEDIDOS_URL}/pedidos/${id}`, data);
    return response;
  }

  async eliminarPedido(id: number): Promise<AxiosResponse<void>> {
    const response = await axios.delete(`${MS_PEDIDOS_URL}/pedidos/${id}`);
    return response;
  }

  // Métodos específicos para productos - Conectando directamente a ms-productos
  async getProductos(params?: any): Promise<AxiosResponse<PaginatedResponse<any>>> {
    const response = await axios.get(`${MS_PRODUCTOS_URL}/productos`, { params });
    return response;
  }

  async getProducto(id: number): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${MS_PRODUCTOS_URL}/productos/${id}`);
    return response;
  }

  async crearProducto(data: any): Promise<AxiosResponse<any>> {
    const response = await axios.post(`${MS_PRODUCTOS_URL}/productos`, data);
    return response;
  }

  async actualizarProducto(id: number, data: any): Promise<AxiosResponse<any>> {
    const response = await axios.put(`${MS_PRODUCTOS_URL}/productos/${id}`, data);
    return response;
  }

  async eliminarProducto(id: number): Promise<AxiosResponse<void>> {
    const response = await axios.delete(`${MS_PRODUCTOS_URL}/productos/${id}`);
    return response;
  }

  // Métodos específicos para pymes - Conectando directamente a ms-user
  async getPymes(params?: any): Promise<AxiosResponse<PaginatedResponse<any>>> {
    const response = await axios.get(`${MS_USER_URL}/pymes`, { params });
    return response;
  }

  async getPyme(id: number): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${MS_USER_URL}/pymes/${id}`);
    return response;
  }

  async crearPyme(data: any): Promise<AxiosResponse<any>> {
    const response = await axios.post(`${MS_USER_URL}/pymes`, data);
    return response;
  }

  async actualizarPyme(id: number, data: any): Promise<AxiosResponse<any>> {
    const response = await axios.put(`${MS_USER_URL}/pymes/${id}`, data);
    return response;
  }

  async eliminarPyme(id: number): Promise<AxiosResponse<void>> {
    const response = await axios.delete(`${MS_USER_URL}/pymes/${id}`);
    return response;
  }

  // Métodos de autenticación - Conectando directamente a ms-user
  async login(email: string, password: string) {
    return axios.post(`${MS_USER_URL}/auth/login`, { email, password });
  }

  async validateToken(token: string): Promise<AxiosResponse<any>> {
    const response = await this.client.post(`${MS_USER_URL}/auth/validate`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
  }

  async changePassword(pymeId: number, currentPassword: string, newPassword: string): Promise<AxiosResponse<any>> {
    const response = await this.client.post(`${MS_USER_URL}/auth/change-password/${pymeId}`, {
      currentPassword,
      newPassword,
      confirmPassword: newPassword
    });
    return response;
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<any>> {
    const response = await this.client.post(`${MS_USER_URL}/auth/refresh`, { refreshToken });
    return response;
  }

  // Métodos del BFF (agregación de datos) - Conectando directamente a BFF
  async getDashboard(pymeId: number) {
    return axios.get(`${BFF_URL}/bff/dashboard/${pymeId}`);
  }

  async getEstadisticasPyme(pymeId: number): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${BFF_URL}/bff/pymes/${pymeId}/estadisticas`);
    return response;
  }

  async getProductosEnriquecidos(pymeId: number, categoria?: string): Promise<AxiosResponse<any>> {
    const params = categoria ? { categoria } : {};
    const response = await axios.get(`${BFF_URL}/bff/pymes/${pymeId}/productos`, { params });
    return response;
  }

  async getPedidosEnriquecidos(pymeId: number, estado?: string): Promise<AxiosResponse<any>> {
    const params = estado ? { estado } : {};
    const response = await axios.get(`${BFF_URL}/bff/pymes/${pymeId}/pedidos`, { params });
    return response;
  }

  async getResumenPyme(pymeId: number): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${BFF_URL}/bff/pymes/${pymeId}/resumen`);
    return response;
  }

  async getBffHealth(): Promise<AxiosResponse<any>> {
    const response = await axios.get(`${BFF_URL}/bff/health`);
    return response;
  }
}

// Exportar instancia única del cliente API
export const apiClient = new ApiClient();

// Exportar por defecto el cliente
export default apiClient;
