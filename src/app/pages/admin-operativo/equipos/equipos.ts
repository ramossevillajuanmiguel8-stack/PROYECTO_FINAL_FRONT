import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { EquipoService, GrupoService } from '../../../services/api.service';
import { Equipo, Grupo } from '../../../models/models';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css'
})
export class Equipos implements OnInit {

  equipos: Equipo[] = [];
  equiposFiltrados: Equipo[] = [];
  grupos: Grupo[] = [];
  busqueda = '';
  filtroGrupo = '';
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  equipoForm: Equipo = {};

  constructor(private equipoService: EquipoService, private grupoService: GrupoService) {}

  ngOnInit(): void {
    this.cargar();
    this.grupoService.getAll().subscribe(d => this.grupos = d);
  }

  cargar(): void {
    this.cargando = true;
    this.equipoService.getAll().subscribe({
      next: (data) => { this.equipos = data; this.filtrar(); this.cargando = false; },
      error: () => { this.error = 'Error al cargar equipos.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    let lista = [...this.equipos];
    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      lista = lista.filter(e => e.nombre?.toLowerCase().includes(q) || e.pais?.toLowerCase().includes(q));
    }
    if (this.filtroGrupo) {
      lista = lista.filter(e => e.grupo?.idGrupo?.toString() === this.filtroGrupo);
    }
    this.equiposFiltrados = lista;
  }

  abrirCrear(): void {
    this.equipoForm = { estado: 'A', grupo: {} };
    this.modoEdicion = false; this.modalAbierto = true; this.error = '';
  }

  abrirEditar(e: Equipo): void {
    this.equipoForm = { ...e, grupo: { idGrupo: e.grupo?.idGrupo } };
    this.modoEdicion = true; this.modalAbierto = true; this.error = '';
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.equipoForm.nombre || !this.equipoForm.pais || !this.equipoForm.grupo?.idGrupo) {
      this.error = 'Nombre, país y grupo son obligatorios.'; return;
    }
    this.equipoService.save(this.equipoForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Equipo actualizado.' : 'Equipo creado.';
        this.cerrarModal(); this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el equipo.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este equipo?')) return;
    this.equipoService.delete(id).subscribe({
      next: () => { this.exito = 'Equipo eliminado.'; this.cargar(); setTimeout(() => this.exito = '', 3000); }
    });
  }
}