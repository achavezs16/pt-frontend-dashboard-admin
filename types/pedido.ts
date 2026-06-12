// Tipos TypeScript para la entidad Pedido
// Basado en la clase Java Pedido del backend

export enum EstadoPedido {
  DISPONIBLE = 'DISPONIBLE',
  ASIGNADO = 'ASIGNADO',
  ACEPTADO = 'ACEPTADO',
  RECHAZADO = 'RECHAZADO',
  PEDIDO_RETIRADO = 'PEDIDO_RETIRADO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

// Usar referencia de tipo para evitar dependencia circular
type PymeRef = import('./pyme').Pyme;

export interface Pedido {
  id: number;
  pyme: PymeRef;
  numeroOrdenPyme: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente?: string;
  direccionEntregaChile: string;
  comunaEntregaChile: string;
  regionEntregaChile: string;
  estadoPedidoPyme: EstadoPedido;
  subtotal: number; // BigDecimal convertido a number
  costoDespachoChile: number;
  totalPedido: number;
  etiquetaDespachoPyme?: string;
  notasPedido?: string;
  creadoEn: string; // LocalDateTime convertido a string ISO
  actualizadoEn?: string;
}

// Para creación de nuevos pedidos (sin campos generados automáticamente)
export interface CrearPedidoRequest {
  pymeId: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  direccionEntrega: string;
  comunaEntrega: string;
  regionEntrega: string;
  subtotal: number;
  costoEnvio?: number;
  detalles: DetallePedidoRequest[];
  notas?: string;
}

export interface DetallePedidoRequest {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

// Para actualización de pedidos
export interface ActualizarPedidoRequest {
  nombreCliente?: string;
  emailCliente?: string;
  telefonoCliente?: string;
  direccionEntregaChile?: string;
  comunaEntregaChile?: string;
  regionEntregaChile?: string;
  estadoPedidoPyme?: EstadoPedido;
  subtotal?: number;
  costoDespachoChile?: number;
  totalPedido?: number;
  notasPedido?: string;
}

// Para respuestas de API
export interface PedidoResponse {
  data: Pedido[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

// Referencia a Pyme para evitar dependencia circular
// Se importará desde el index.ts
