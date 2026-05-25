import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { AuthService } from '../../../services/auth.service';
import { UsuarioService } from '../../../services/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil {

  passwordForm = { actual: '', nueva: '', confirmar: '' };
  mostrarActual = false;
  mostrarNueva = false;
  cargando = false;
  error = '';
  exito = '';

  constructor(
    public auth: AuthService,
    private usuarioService: UsuarioService
  ) {}

  cambiarClave(): void {
    if (!this.passwordForm.actual || !this.passwordForm.nueva) {
      this.error = 'Completa todos los campos.'; return;
    }
    if (this.passwordForm.nueva !== this.passwordForm.confirmar) {
      this.error = 'Las contraseñas nuevas no coinciden.'; return;
    }
    if (this.passwordForm.nueva.length < 6 || this.passwordForm.nueva.length > 8) {
      this.error = 'La contraseña debe tener entre 6 y 8 caracteres.'; return;
    }

    this.cargando = true;
    this.error = '';

    const usuario = {
      ...this.auth.usuario,
      password: this.passwordForm.nueva
    };

    this.usuarioService.save(usuario).subscribe({
      next: () => {
        this.exito = 'Contraseña actualizada correctamente.';
        this.passwordForm = { actual: '', nueva: '', confirmar: '' };
        this.cargando = false;
        setTimeout(() => this.exito = '', 4000);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.status === 400
          ? 'La contraseña debe tener entre 6 y 8 caracteres, una mayúscula, una minúscula y un número.'
          : 'Error al actualizar la contraseña.';
      }
    });
  }

  logout(): void { this.auth.logout(); }

  get iniciales(): string {
    return this.auth.usuario?.nombreapellido
      ?.split(' ').map(n => n.charAt(0)).slice(0,2).join('').toUpperCase() ?? 'U';
  }
}