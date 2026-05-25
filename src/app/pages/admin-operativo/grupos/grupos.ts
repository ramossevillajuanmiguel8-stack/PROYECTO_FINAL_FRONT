import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { GrupoService } from '../../../services/api.service';
import { Grupo } from '../../../models/models';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class Grupos implements OnInit {

  grupos: Grupo[] = [];
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  grupoForm: Grupo = {};

  constructor(private grupoService: GrupoService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.grupoService.getAll().subscribe({
      next: (data) => { this.grupos = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar grupos.'; this.cargando = false; }
    });
  }

  abrirCrear(): void {
    this.grupoForm = { estado: 'A' };
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
  }

  abrirEditar(g: Grupo): void {
    this.grupoForm = { ...g };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.grupoForm.nombre) { this.error = 'El nombre del grupo es obligatorio.'; return; }
    this.grupoService.save(this.grupoForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Grupo actualizado.' : 'Grupo creado.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el grupo.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este grupo?')) return;
    this.grupoService.delete(id).subscribe({
      next: () => { this.exito = 'Grupo eliminado.'; this.cargar(); setTimeout(() => this.exito = '', 3000); }
    });
  }
}