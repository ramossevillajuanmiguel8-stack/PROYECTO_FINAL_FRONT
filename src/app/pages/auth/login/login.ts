import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login{

  credenciales: LoginRequest = { username: '', password: '' };
  cargando = false;
  error = '';
  mostrarPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.credenciales.username || !this.credenciales.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login(this.credenciales).subscribe({
      next: (res) => {
        this.cargando = false;
        const idRol = res.usuario?.rol?.idRol;
        switch (idRol) {
          case 1: this.router.navigate(['/admin/dashboard']);     break;
          case 2: this.router.navigate(['/operativo/dashboard']); break;
          case 3: this.router.navigate(['/operario/dashboard']);  break;
          case 4: this.router.navigate(['/cliente/inicio']);      break;
          default: this.error = 'Rol no reconocido.';
        }
      },
      error: (err) => {
        this.cargando = false;
        const status = err.status;
        if (status === 401) this.error = 'Contraseña incorrecta.';
        else if (status === 403) this.error = 'Cuenta bloqueada. Contacta al administrador.';
        else if (status === 404) this.error = 'Usuario no encontrado.';
        else this.error = 'Error al conectar con el servidor.';
      }
    });
  }
}