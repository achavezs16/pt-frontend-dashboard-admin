// User types from backend
export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido?: string;
  rol: 'ADMIN' | 'PYME' | 'REPARTIDOR';
  pymeId?: number;
  activo: boolean;
}

// Pyme types from backend
export interface Pyme {
  id: number;
  nombrePyme: string;
  rutPyme: string;
  emailContactoPyme: string;
  telefonoContactoPyme?: string;
  direccionSucursalPyme?: string;
  comunaSucursalPyme?: string;
  regionSucursalPyme?: string;
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

// Admin stats from backend
export interface AdminStats {
  totalAdmins: number;
  totalPymes: number;
  totalRepartidores: number;
}

// Pedido types from backend
export interface Pedido {
  id: number;
  idPyme: number;
  numeroOrdenPyme: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente?: string;
  direccionEntregaChile: string;
  comunaEntregaChile: string;
  regionEntregaChile: string;
  estadoPedidoPyme: string;
  subtotal: number;
  costoDespachoChile: number;
  totalPedido: number;
  etiquetaDespachoPyme?: string;
  notasPedido?: string;
  creadoEn: string;
  actualizadoEn?: string;
}

// Frontend specific types
export interface PymeConRepartidores extends Pyme {
  repartidores: number;
}

export interface RepartidorConPyme extends User {
  pymeNombre?: string;
}
