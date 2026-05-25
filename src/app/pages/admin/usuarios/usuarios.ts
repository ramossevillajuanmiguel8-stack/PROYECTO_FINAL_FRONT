import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { UsuarioService, RolService } from '../../../services/api.service';
import { Usuario, Rol } from '../../../models/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  roles: Rol[] = [];
  busqueda = '';
  cargando = true;
  error = '';
  exito = '';

  // Modal
  modalAbierto = false;
  modoEdicion = false;
  usuarioForm: Usuario = {};

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.rolService.getAll().subscribe(r => this.roles = r);
  }

  cargar(): void {
    this.cargando = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filtrar();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar usuarios.';
        this.cargando = false;
      }
    });
  }

  filtrar(): void {
    const q = this.busqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.nombreapellido?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  }

  abrirCrear(): void {
    this.usuarioForm = { estado: 'A', rol: { idRol: 2 } };
    this.modoEdicion = false;
    this.modalAbierto = true;
  }

  abrirEditar(u: Usuario): void {
    this.usuarioForm = { ...u, password: '' };
    this.modoEdicion = true;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.error = '';
  }

  guardar(): void {
    this.usuarioService.save(this.usuarioForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Usuario actualizado.' : 'Usuario creado. Se enviaron las credenciales al correo.';
        this.cerrarModal();
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: (err) => {
        this.error = err.status === 400
          ? 'Contraseña inválida. Debe tener 6-8 caracteres, mayúscula, minúscula y número.'
          : 'Error al guardar el usuario.';
      }
    });
  }

  desbloquear(id: number): void {
    this.usuarioService.desbloquear(id).subscribe({
      next: () => {
        this.exito = 'Usuario desbloqueado correctamente.';
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    this.usuarioService.delete(id).subscribe({
      next: () => {
        this.exito = 'Usuario eliminado.';
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  get nombreRol(): (idRol?: number) => string {
    return (idRol) => this.roles.find(r => r.idRol === idRol)?.nombre ?? '-';
  }

  badgeEstado(estado?: string): string {
    return estado === 'A' ? 'bg-success' : 'bg-danger';
  }

  textoEstado(estado?: string): string {
    return estado === 'A' ? 'Activo' : 'Inactivo';
  }
}