import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly API = environment.apiUrl;
  private readonly KEY = 'mundial_usuario';

  usuarioActual = signal<Usuario | null>(this.cargarDesdeStorage());

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API}/usuario/login`, credenciales).pipe(
      tap(res => {
        localStorage.setItem(this.KEY, JSON.stringify(res.usuario));
        this.usuarioActual.set(res.usuario);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.KEY);
    this.usuarioActual.set(null);
    this.router.navigate(['/login']);
  }

  get estaLogueado(): boolean {
    return this.usuarioActual() !== null;
  }

  get idRol(): number {
    return this.usuarioActual()?.rol?.idRol ?? 0;
  }

  get usuario(): Usuario | null {
    return this.usuarioActual();
  }

  esAdmin(): boolean    { return this.idRol === 1; }
  esAdminOp(): boolean  { return this.idRol === 2; }
  esOperario(): boolean { return this.idRol === 3; }
  esCliente(): boolean  { return this.idRol === 4; }

  private cargarDesdeStorage(): Usuario | null {
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  }
}