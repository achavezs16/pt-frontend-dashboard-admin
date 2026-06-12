// Tipos comunes para todo el frontend

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface FiltrosPedidos {
  estado?: string;
  cliente?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}

export interface FiltrosProductos {
  nombre?: string;
  codigoSKU?: string;
  activo?: boolean;
  page?: number;
  size?: number;
}

// Estados de loading
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Para formularios
export interface FormErrors {
  [key: string]: string;
}
