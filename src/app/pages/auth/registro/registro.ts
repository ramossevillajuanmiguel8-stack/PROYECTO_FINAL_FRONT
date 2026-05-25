import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/api.service';
import { Usuario } from '../../../models/models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  usuario: Usuario = {
    username: '',
    password: '',
    nombreapellido: '',
    email: '',
    rol: { idRol: 4 } // Siempre Cliente — no editable por el usuario
  };

  confirmarPassword = '';
  cargando = false;
  error = '';
  exito = '';
  mostrarPassword = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  registrar(): void {
    if (!this.usuario.username || !this.usuario.password ||
        !this.usuario.nombreapellido || !this.usuario.email) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }
    if (this.usuario.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.error = '';

    // Forzar rol Cliente antes de enviar
    this.usuario.rol = { idRol: 4 };

    this.usuarioService.save(this.usuario).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = '¡Registro exitoso! Te enviamos las credenciales a tu correo.';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400) {
          this.error = 'La contraseña debe tener entre 6 y 8 caracteres, una mayúscula, una minúscula y un número.';
        } else {
          this.error = 'Error al registrar. Intenta de nuevo.';
        }
      }
    });
  }
}