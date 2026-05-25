import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/api.service';
import { RolService } from '../../../services/api.service';
import { Usuario, Rol } from '../../../models/models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro implements OnInit {

  usuario: Usuario = {
    username: '',
    password: '',
    nombreapellido: '',
    email: '',
    rol: { idRol: 4 }
  };

  confirmarPassword = '';
  cargando = false;
  error = '';
  exito = '';
  mostrarPassword = false;
  roles: Rol[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rolService.getAll().subscribe({
      next: (roles) => {
        // Solo mostrar roles que no sean Administrador en el registro público
        this.roles = roles.filter(r => r.idRol !== 1);
      }
    });
  }

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

    this.usuarioService.save(this.usuario).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = 'Registro exitoso. Te enviamos las credenciales a tu correo.';
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 400) this.error = 'La contraseña debe tener entre 6 y 8 caracteres, una mayúscula, una minúscula y un número.';
        else this.error = 'Error al registrar. Intenta de nuevo.';
      }
    });
  }
}