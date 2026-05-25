import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PartidoService, JugadorService, ResultadoService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard-operario',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  programados = 0;
  jugados = 0;
  totalJugadores = 0;

  acciones = [
    { label: 'Jugadores',  icon: 'bi-person-badge', ruta: '/operario/jugadores',  color: '#993C1D' },
    { label: 'Resultados', icon: 'bi-trophy',        ruta: '/operario/resultados', color: '#1D9E75' },
  ];

  constructor(
    private partidoService: PartidoService,
    private jugadorService: JugadorService
  ) {}

  ngOnInit(): void {
    this.partidoService.getProgramados().subscribe(d => { this.programados = d.length; });
    this.partidoService.getJugados().subscribe(d => { this.jugados = d.length; });
    this.jugadorService.getAll().subscribe(d => { this.totalJugadores = d.length; });
  }
}