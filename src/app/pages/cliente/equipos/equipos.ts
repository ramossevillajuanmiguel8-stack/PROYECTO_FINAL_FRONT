import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { EquipoService, JugadorService, GrupoService } from '../../../services/api.service';
import { Equipo, Jugador, Grupo } from '../../../models/models';

@Component({
  selector: 'app-equipos-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './equipos.html',
  styleUrl: './equipos.css'
})
export class EquiposCliente implements OnInit {

  equipos: Equipo[] = [];
  equiposFiltrados: Equipo[] = [];
  grupos: Grupo[] = [];
  jugadoresEquipo: Jugador[] = [];
  equipoDetalle: Equipo | null = null;
  busqueda = '';
  filtroGrupo = '';
  cargando = true;
  cargandoJugadores = false;

  constructor(
    private equipoService: EquipoService,
    private jugadorService: JugadorService,
    private grupoService: GrupoService
  ) {}

  ngOnInit(): void {
    this.equipoService.getAll().subscribe({
      next: (d) => { this.equipos = d; this.filtrar(); this.cargando = false; }
    });
    this.grupoService.getAll().subscribe(d => this.grupos = d);
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

  verDetalle(e: Equipo): void {
    this.equipoDetalle = e;
    this.jugadoresEquipo = [];
    this.cargandoJugadores = true;
    this.jugadorService.getAll().subscribe({
      next: (data) => {
        this.jugadoresEquipo = data.filter(j => j.equipo?.idEquipo === e.idEquipo);
        this.cargandoJugadores = false;
      }
    });
  }

  cerrarDetalle(): void { this.equipoDetalle = null; }

  colorPosicion(pos?: string): string {
    switch(pos) {
      case 'Portero': return '#0A2342';
      case 'Defensa': return '#1D9E75';
      case 'Centrocampista': return '#534AB7';
      case 'Delantero': return '#993C1D';
      default: return '#888';
    }
  }

  equiposPorGrupo(idGrupo?: number): Equipo[] {
    return this.equipos.filter(e => e.grupo?.idGrupo === idGrupo);
  }
}