import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { RolService } from '../../../services/api.service';
import { Rol } from '../../../models/models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './roles.html',
  styleUrl: './roles.css'
})
export class Roles implements OnInit {

  roles: Rol[] = [];
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  rolForm: Rol = {};

  constructor(private rolService: RolService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.rolService.getAll().subscribe({
      next: (data) => { this.roles = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar roles.'; this.cargando = false; }
    });
  }

  abrirCrear(): void {
    this.rolForm = { estado: 'A' };
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
  }

  abrirEditar(r: Rol): void {
    this.rolForm = { ...r };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.rolForm.nombre) { this.error = 'El nombre del rol es obligatorio.'; return; }
    this.rolService.save(this.rolForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Rol actualizado.' : 'Rol creado.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el rol.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este rol? Los usuarios con este rol pueden verse afectados.')) return;
    this.rolService.delete(id).subscribe({
      next: () => { this.exito = 'Rol eliminado.'; this.cargar(); setTimeout(() => this.exito = '', 3000); },
      error: () => { this.error = 'No se puede eliminar: hay usuarios con este rol.'; }
    });
  }

  colorRol(id?: number): string {
    switch(id) {
      case 1: return '#534AB7';
      case 2: return '#0F6E56';
      case 3: return '#993C1D';
      case 4: return '#993556';
      default: return '#0A2342';
    }
  }

  bgRol(id?: number): string {
    switch(id) {
      case 1: return '#EEEDFE';
      case 2: return '#E1F5EE';
      case 3: return '#FAECE7';
      case 4: return '#FBEAF0';
      default: return '#EEF3FE';
    }
  }
}