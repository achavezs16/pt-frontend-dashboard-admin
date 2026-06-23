// Tipos TypeScript para la entidad Pyme
// Basado en la clase Java Pyme del backend

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
  creadoEn: string; // LocalDateTime convertido a string ISO
  actualizadoEn?: string;
}

// Para creación de nuevas pymes
export interface CrearPymeRequest {
  nombrePyme: string;
  rutPyme: string;
  emailContactoPyme: string;
  telefonoContactoPyme?: string;
  direccionSucursalPyme?: string;
  comunaSucursalPyme?: string;
  regionSucursalPyme?: string;
}

// Para actualización de pymes
export interface ActualizarPymeRequest {
  nombrePyme?: string;
  emailContactoPyme?: string;
  telefonoContactoPyme?: string;
  direccionSucursalPyme?: string;
  comunaSucursalPyme?: string;
  regionSucursalPyme?: string;
  activo?: boolean;
}

// Para respuestas de API
export interface PymeResponse {
  data: Pyme[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
