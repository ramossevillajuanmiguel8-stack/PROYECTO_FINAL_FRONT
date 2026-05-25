import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PartidoService, EquipoService, EstadioService, GrupoService } from '../../../services/api.service';
import { Partido, Equipo, Estadio, Grupo } from '../../../models/models';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './partidos.html',
  styleUrl: './partidos.css'
})
export class Partidos implements OnInit {

  partidos: Partido[] = [];
  partidosFiltrados: Partido[] = [];
  equipos: Equipo[] = [];
  estadios: Estadio[] = [];
  grupos: Grupo[] = [];

  filtroEstado = '';
  busqueda = '';
  cargando = true;
  error = '';
  exito = '';

  modalAbierto = false;
  modoEdicion = false;
  partidoForm: Partido = {};

  constructor(
    private partidoService: PartidoService,
    private equipoService: EquipoService,
    private estadioService: EstadioService,
    private grupoService: GrupoService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.equipoService.getAll().subscribe(d => this.equipos = d);
    this.estadioService.getAll().subscribe(d => this.estadios = d);
    this.grupoService.getAll().subscribe(d => this.grupos = d);
  }

  cargar(): void {
    this.cargando = true;
    this.partidoService.getAll().subscribe({
      next: (data) => {
        this.partidos = data.sort((a, b) =>
          new Date(a.fechaHora ?? '').getTime() - new Date(b.fechaHora ?? '').getTime()
        );
        this.filtrar();
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar partidos.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    let lista = [...this.partidos];
    if (this.filtroEstado) {
      lista = lista.filter(p => p.estado === this.filtroEstado);
    }
    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      lista = lista.filter(p =>
        p.equipoLocal?.nombre?.toLowerCase().includes(q) ||
        p.equipoVisitante?.nombre?.toLowerCase().includes(q) ||
        p.fase?.toLowerCase().includes(q)
      );
    }
    this.partidosFiltrados = lista;
  }

  abrirCrear(): void {
    this.partidoForm = {
      estado: 'P',
      equipoLocal: {},
      equipoVisitante: {},
      estadio: {},
      grupo: {}
    };
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
  }

  abrirEditar(p: Partido): void {
    this.partidoForm = {
      ...p,
      fechaHora: p.fechaHora ? p.fechaHora.substring(0, 16) : '',
      equipoLocal: { idEquipo: p.equipoLocal?.idEquipo },
      equipoVisitante: { idEquipo: p.equipoVisitante?.idEquipo },
      estadio: { idEstadio: p.estadio?.idEstadio },
      grupo: { idGrupo: p.grupo?.idGrupo }
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.error = '';
  }

  guardar(): void {
    if (!this.partidoForm.equipoLocal?.idEquipo ||
        !this.partidoForm.equipoVisitante?.idEquipo ||
        !this.partidoForm.estadio?.idEstadio ||
        !this.partidoForm.grupo?.idGrupo ||
        !this.partidoForm.fechaHora ||
        !this.partidoForm.fase) {
      this.error = 'Completa todos los campos obligatorios.';
      return;
    }
    if (this.partidoForm.equipoLocal?.idEquipo === this.partidoForm.equipoVisitante?.idEquipo) {
      this.error = 'El equipo local y visitante no pueden ser el mismo.';
      return;
    }
    this.partidoService.save(this.partidoForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Partido actualizado.' : 'Partido creado.';
        this.cerrarModal();
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el partido.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este partido?')) return;
    this.partidoService.delete(id).subscribe({
      next: () => {
        this.exito = 'Partido eliminado.';
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  badgeEstado(estado?: string): object {
    return {
      'badge-programado': estado === 'P',
      'badge-jugado':     estado === 'J',
      'badge-cancelado':  estado === 'C'
    };
  }

  textoEstado(estado?: string): string {
    switch(estado) {
      case 'P': return 'Programado';
      case 'J': return 'Jugado';
      case 'C': return 'Cancelado';
      default:  return estado ?? '-';
    }
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  get totalProgramados(): number { return this.partidos.filter(p => p.estado === 'P').length; }
  get totalJugados(): number     { return this.partidos.filter(p => p.estado === 'J').length; }
}