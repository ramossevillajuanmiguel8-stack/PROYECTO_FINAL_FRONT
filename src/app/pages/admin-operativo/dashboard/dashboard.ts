import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { PartidoService, EquipoService, GrupoService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard-operativo',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {

  totalPartidos = 0;
  totalEquipos = 0;
  totalGrupos = 0;
  programados = 0;

  acciones = [
    { label: 'Grupos',    icon: 'bi-collection', ruta: '/operativo/grupos',   color: '#0F6E56' },
    { label: 'Equipos',   icon: 'bi-flag',        ruta: '/operativo/equipos',  color: '#0A2342' },
    { label: 'Estadios',  icon: 'bi-building',    ruta: '/operativo/estadios', color: '#1D9E75' },
    { label: 'Ciudades',  icon: 'bi-geo-alt',     ruta: '/operativo/ciudades', color: '#F5C518' },
    { label: 'Partidos',  icon: 'bi-calendar3',   ruta: '/operativo/partidos', color: '#534AB7' },
    { label: 'Reportes',  icon: 'bi-bar-chart',   ruta: '/operativo/reportes', color: '#993C1D' },
  ];

  constructor(
    private partidoService: PartidoService,
    private equipoService: EquipoService,
    private grupoService: GrupoService
  ) {}

  ngOnInit(): void {
    this.partidoService.getAll().subscribe(d => { this.totalPartidos = d.length; });
    this.partidoService.getProgramados().subscribe(d => { this.programados = d.length; });
    this.equipoService.getAll().subscribe(d => { this.totalEquipos = d.length; });
    this.grupoService.getAll().subscribe(d => { this.totalGrupos = d.length; });
  }
}