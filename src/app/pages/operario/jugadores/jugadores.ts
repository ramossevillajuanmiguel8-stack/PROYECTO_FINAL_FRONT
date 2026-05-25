import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { JugadorService, EquipoService } from '../../../services/api.service';
import { Jugador, Equipo } from '../../../models/models';

@Component({
  selector: 'app-jugadores',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './jugadores.html',
  styleUrl: './jugadores.css'
})
export class Jugadores implements OnInit {

  jugadores: Jugador[] = [];
  jugadoresFiltrados: Jugador[] = [];
  equipos: Equipo[] = [];
  busqueda = '';
  filtroEquipo = '';
  cargando = true;
  error = '';
  exito = '';
  modalAbierto = false;
  modoEdicion = false;
  jugadorForm: Jugador = {};

  posiciones = ['Portero','Defensa','Centrocampista','Delantero'];

  constructor(
    private jugadorService: JugadorService,
    private equipoService: EquipoService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.equipoService.getAll().subscribe(d => this.equipos = d);
  }

  cargar(): void {
    this.cargando = true;
    this.jugadorService.getAll().subscribe({
      next: (data) => {
        this.jugadores = data.sort((a, b) =>
          (a.equipo?.nombre ?? '').localeCompare(b.equipo?.nombre ?? '')
        );
        this.filtrar();
        this.cargando = false;
      },
      error: () => { this.error = 'Error al cargar jugadores.'; this.cargando = false; }
    });
  }

  filtrar(): void {
    let lista = [...this.jugadores];
    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      lista = lista.filter(j =>
        j.nombre?.toLowerCase().includes(q) ||
        j.apellido?.toLowerCase().includes(q) ||
        j.posicion?.toLowerCase().includes(q)
      );
    }
    if (this.filtroEquipo) {
      lista = lista.filter(j => j.equipo?.idEquipo?.toString() === this.filtroEquipo);
    }
    this.jugadoresFiltrados = lista;
  }

  abrirCrear(): void {
    this.jugadorForm = { estado: 'A', equipo: {} };
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
  }

  abrirEditar(j: Jugador): void {
    this.jugadorForm = {
      ...j,
      fechaNacimiento: j.fechaNacimiento ? j.fechaNacimiento.substring(0, 10) : '',
      equipo: { idEquipo: j.equipo?.idEquipo }
    };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
  }

  cerrarModal(): void { this.modalAbierto = false; this.error = ''; }

  guardar(): void {
    if (!this.jugadorForm.nombre || !this.jugadorForm.apellido ||
        !this.jugadorForm.equipo?.idEquipo || !this.jugadorForm.posicion) {
      this.error = 'Nombre, apellido, posición y equipo son obligatorios.';
      return;
    }
    this.jugadorService.save(this.jugadorForm).subscribe({
      next: () => {
        this.exito = this.modoEdicion ? 'Jugador actualizado.' : 'Jugador registrado.';
        this.cerrarModal();
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      },
      error: () => { this.error = 'Error al guardar el jugador.'; }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este jugador?')) return;
    this.jugadorService.delete(id).subscribe({
      next: () => {
        this.exito = 'Jugador eliminado.';
        this.cargar();
        setTimeout(() => this.exito = '', 3000);
      }
    });
  }

  colorPosicion(pos?: string): string {
    switch(pos) {
      case 'Portero':        return '#0A2342';
      case 'Defensa':        return '#1D9E75';
      case 'Centrocampista': return '#534AB7';
      case 'Delantero':      return '#993C1D';
      default:               return '#888';
    }
  }

  bgPosicion(pos?: string): string {
    switch(pos) {
      case 'Portero':        return '#EEF3FE';
      case 'Defensa':        return '#E8F8F2';
      case 'Centrocampista': return '#EEF3FE';
      case 'Delantero':      return '#FDECEA';
      default:               return '#f0f0f0';
    }
  }

  calcularEdad(fecha?: string): number {
    if (!fecha) return 0;
    const hoy = new Date();
    const nac = new Date(fecha);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  }
}