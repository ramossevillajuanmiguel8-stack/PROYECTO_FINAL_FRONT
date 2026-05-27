import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Usuario, Rol, Ciudad, Grupo, Equipo, Estadio,
  Jugador, Partido, Resultado, Prediccion, Parametro, Auditoria
} from '../models/models';

const API = environment.apiUrl;

// ─────────────────────────────────────────────
// USUARIO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API}/usuario/getAll`);
  }
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${API}/usuario/findRecord/${id}`);
  }
  getRanking(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${API}/usuario/ranking`);
  }
  save(usuario: Usuario): Observable<any> {
    return this.http.post<any>(`${API}/usuario/saveUsuario`, usuario);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/usuario/deleteUsuario/${id}`);
  }
  desbloquear(id: number): Observable<any> {
    return this.http.put<any>(`${API}/usuario/desbloquear/${id}`, {});
  }
  cambiarClave(idUsuario: number, claveNueva: string): Observable<any> {
    const params = new HttpParams()
      .set('idUsuario', idUsuario)
      .set('claveNueva', claveNueva);
    return this.http.put<any>(`${API}/usuario/cambiarClave`, {}, { params });
  }
}

// ─────────────────────────────────────────────
// ROL
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class RolService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${API}/rol/getAll`);
  }
  getById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${API}/rol/findRecord/${id}`);
  }
  save(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${API}/rol/saveRol`, rol);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/rol/deleteRol/${id}`);
  }
}

// ─────────────────────────────────────────────
// CIUDAD
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class CiudadService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${API}/ciudad/getAll`);
  }
  getById(id: number): Observable<Ciudad> {
    return this.http.get<Ciudad>(`${API}/ciudad/findRecord/${id}`);
  }
  save(ciudad: Ciudad): Observable<Ciudad> {
    return this.http.post<Ciudad>(`${API}/ciudad/saveCiudad`, ciudad);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/ciudad/deleteCiudad/${id}`);
  }
}

// ─────────────────────────────────────────────
// GRUPO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class GrupoService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(`${API}/grupo/getAll`);
  }
  getById(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${API}/grupo/findRecord/${id}`);
  }
  save(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(`${API}/grupo/saveGrupo`, grupo);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/grupo/deleteGrupo/${id}`);
  }
}

// ─────────────────────────────────────────────
// EQUIPO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class EquipoService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${API}/equipo/getAll`);
  }
  getById(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${API}/equipo/findRecord/${id}`);
  }
  save(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(`${API}/equipo/saveEquipo`, equipo);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/equipo/deleteEquipo/${id}`);
  }
}

// ─────────────────────────────────────────────
// ESTADIO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class EstadioService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Estadio[]> {
    return this.http.get<Estadio[]>(`${API}/estadio/getAll`);
  }
  getById(id: number): Observable<Estadio> {
    return this.http.get<Estadio>(`${API}/estadio/findRecord/${id}`);
  }
  save(estadio: Estadio): Observable<Estadio> {
    return this.http.post<Estadio>(`${API}/estadio/saveEstadio`, estadio);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/estadio/deleteEstadio/${id}`);
  }
}

// ─────────────────────────────────────────────
// JUGADOR
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class JugadorService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Jugador[]> {
    return this.http.get<Jugador[]>(`${API}/jugador/getAll`);
  }
  getById(id: number): Observable<Jugador> {
    return this.http.get<Jugador>(`${API}/jugador/findRecord/${id}`);
  }
  save(jugador: Jugador): Observable<Jugador> {
    return this.http.post<Jugador>(`${API}/jugador/saveJugador`, jugador);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/jugador/deleteJugador/${id}`);
  }
}

// ─────────────────────────────────────────────
// PARTIDO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PartidoService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${API}/partido/getAll`);
  }
  getById(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${API}/partido/findRecord/${id}`);
  }
  getProgramados(): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${API}/partido/programados`);
  }
  getJugados(): Observable<Partido[]> {
    return this.http.get<Partido[]>(`${API}/partido/jugados`);
  }
  save(partido: Partido): Observable<Partido> {
    return this.http.post<Partido>(`${API}/partido/savePartido`, partido);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/partido/deletePartido/${id}`);
  }
}

// ─────────────────────────────────────────────
// RESULTADO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ResultadoService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Resultado[]> {
    return this.http.get<Resultado[]>(`${API}/resultado/getAll`);
  }
  getById(id: number): Observable<Resultado> {
    return this.http.get<Resultado>(`${API}/resultado/findRecord/${id}`);
  }
  getByPartido(idPartido: number): Observable<any> {
    return this.http.get<any>(`${API}/resultado/partido/${idPartido}`);
  }
  save(resultado: Resultado): Observable<Resultado> {
    return this.http.post<Resultado>(`${API}/resultado/saveResultado`, resultado);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/resultado/deleteResultado/${id}`);
  }
}

// ─────────────────────────────────────────────
// PREDICCION
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class PrediccionService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Prediccion[]> {
    return this.http.get<Prediccion[]>(`${API}/prediccion/getAll`);
  }
  getByUsuario(idUsuario: number): Observable<Prediccion[]> {
    return this.http.get<Prediccion[]>(`${API}/prediccion/usuario/${idUsuario}`);
  }
  getByPartido(idPartido: number): Observable<Prediccion[]> {
    return this.http.get<Prediccion[]>(`${API}/prediccion/partido/${idPartido}`);
  }
  save(prediccion: Prediccion): Observable<any> {
    return this.http.post<any>(`${API}/prediccion/savePrediccion`, prediccion);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/prediccion/deletePrediccion/${id}`);
  }
}

// ─────────────────────────────────────────────
// PARAMETRO
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ParametroService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Parametro[]> {
    return this.http.get<Parametro[]>(`${API}/parametro/getAll`);
  }
  getById(id: number): Observable<Parametro> {
    return this.http.get<Parametro>(`${API}/parametro/findRecord/${id}`);
  }
  save(parametro: Parametro): Observable<Parametro> {
    return this.http.post<Parametro>(`${API}/parametro/saveParametro`, parametro);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/parametro/deleteParametro/${id}`);
  }
}

// ─────────────────────────────────────────────
// AUDITORIA
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(`${API}/auditoria/getAll`);
  }
  getById(id: number): Observable<Auditoria> {
    return this.http.get<Auditoria>(`${API}/auditoria/findRecord/${id}`);
  }
}

// ─────────────────────────────────────────────
// REPORTE
// ─────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ReporteService {
  constructor(private http: HttpClient) {}

  private descargar(endpoint: string, formato: string, nombreBase: string): void {
    // Mapear formato a extensión correcta
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `${nombreBase}.${extension}`;

    this.http.get(`${API}/reporte/${endpoint}`, {
      params: { formato },
      responseType: 'blob'
    }).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  predicciones(formato: string) { this.descargar('predicciones', formato, 'predicciones_usuarios'); }
  goles(formato: string)        { this.descargar('goles',        formato, 'goles_por_fase'); }
  equipos(formato: string)      { this.descargar('equipos',      formato, 'rendimiento_equipos'); }
  ranking(formato: string)      { this.descargar('ranking',      formato, 'ranking_usuarios'); }
  auditoria(formato: string)    { this.descargar('auditoria',    formato, 'actividad_auditoria'); }
}