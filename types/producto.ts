// Tipos TypeScript para la entidad Producto
// Basado en la clase Java Producto del backend

// Enum de categorías de productos (debe coincidir con backend)
export enum CategoriaProducto {
  SMARTPHONE = 'SMARTPHONE',
  NOTEBOOK = 'NOTEBOOK',
  COMPUTADOR = 'COMPUTADOR',
  ACCESORIOS = 'ACCESORIOS'
}

// Usar referencia de tipo para evitar dependencia circular
type PymeRef = import('./pyme').Pyme;

export interface Producto {
  id: number;
  pyme: PymeRef;
  codigoSKU: string;
  nombreProducto: string;
  descripcionProducto?: string;
  precioVentaChile: number; // BigDecimal convertido a number
  pesoProductoKg?: number;
  dimensionesProducto?: string;
  imagenUrl?: string; // URL de la imagen del producto
  categoriaProducto: CategoriaProducto; // Nueva campo
  activo: boolean;
  creadoEn: string; // LocalDateTime convertido a string ISO
  actualizadoEn?: string;
}

// Para creación de nuevos productos
export interface CrearProductoRequest {
  pymeId: number;
  codigoSKU: string;
  nombreProducto: string;
  descripcionProducto?: string;
  precioVentaChile: number;
  pesoProductoKg?: number;
  dimensionesProducto?: string;
  imagenUrl?: string; // URL de la imagen del producto
  categoriaProducto: CategoriaProducto; // Nueva campo requerido
}

// Para actualización de productos
export interface ActualizarProductoRequest {
  codigoSKU?: string;
  nombreProducto?: string;
  descripcionProducto?: string;
  precioVentaChile?: number;
  pesoProductoKg?: number;
  dimensionesProducto?: string;
  imagenUrl?: string; // URL de la imagen del producto
  categoriaProducto?: CategoriaProducto; // Nueva campo opcional
  activo?: boolean;
}

// Para respuestas de API
export interface ProductoResponse {
  data: Producto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Importar Pyme para evitar dependencia circular
import { Pyme } from './pyme';
