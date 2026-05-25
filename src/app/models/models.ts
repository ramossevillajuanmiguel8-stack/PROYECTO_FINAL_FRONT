export interface Rol {
  idRol?: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
}

export interface Usuario {
  idUsuario?: number;
  username?: string;
  password?: string;
  nombreapellido?: string;
  email?: string;
  estado?: string;
  intentos?: number;
  fchaUltClave?: string;
  puntosTotales?: number;
  rol?: Rol;
}

export interface Ciudad {
  idCiudad?: number;
  nombre?: string;
  pais?: string;
  estado?: string;
}

export interface Grupo {
  idGrupo?: number;
  nombre?: string;
  estado?: string;
}

export interface Equipo {
  idEquipo?: number;
  nombre?: string;
  pais?: string;
  escudoUrl?: string;
  estado?: string;
  grupo?: Grupo;
}

export interface Estadio {
  idEstadio?: number;
  nombre?: string;
  capacidad?: number;
  estado?: string;
  ciudad?: Ciudad;
}

export interface Jugador {
  idJugador?: number;
  nombre?: string;
  apellido?: string;
  numeroCamiseta?: number;
  posicion?: string;
  fechaNacimiento?: string;
  estado?: string;
  equipo?: Equipo;
}

export interface Partido {
  idPartido?: number;
  fechaHora?: string;
  estado?: string;
  fase?: string;
  equipoLocal?: Equipo;
  equipoVisitante?: Equipo;
  estadio?: Estadio;
  grupo?: Grupo;
  resultado?: Resultado;
}

export interface Resultado {
  idResultado?: number;
  golesLocal?: number;
  golesVisitante?: number;
  ganador?: string;
  fechaRegistro?: string;
  observaciones?: string;
  partido?: Partido;
}

export interface Prediccion {
  idPrediccion?: number;
  golesLocalPredicho?: number;
  golesVisitantePredicho?: number;
  ganadorPredicho?: string;
  puntosGanados?: number;
  estado?: string;
  fechaPrediccion?: string;
  usuario?: Usuario;
  partido?: Partido;
}

export interface Parametro {
  idParametro?: number;
  clave?: string;
  valor?: string;
  descripcion?: string;
  estado?: string;
}

export interface Auditoria {
  id?: number;
  idUsuario?: number;
  accionAudtria?: string;
  tablaAfectada?: string;
  idRegistroAfectado?: number;
  fechaHoraAudtria?: string;
  ipCliente?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}