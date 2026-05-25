import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { UsuarioService, AuditoriaService } from '../../../services/api.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  totalUsuarios = 0;
  totalLogs = 0;
  cargando = true;

  acciones = [
    { label: 'Gestionar usuarios',  icon: 'bi-people',       ruta: '/admin/usuarios',   color: '#534AB7' },
    { label: 'Gestionar roles',     icon: 'bi-shield',        ruta: '/admin/roles',      color: '#0A2342' },
    { label: 'Parámetros',          icon: 'bi-sliders',       ruta: '/admin/parametros', color: '#1D9E75' },
    { label: 'Auditoría',           icon: 'bi-journal-text',  ruta: '/admin/auditoria',  color: '#F5C518' },
    { label: 'Reportes',            icon: 'bi-bar-chart',     ruta: '/admin/reportes',   color: '#993C1D' },
  ];

  constructor(
    private usuarioService: UsuarioService,
    private auditoriaService: AuditoriaService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe({
      next: (data) => { this.totalUsuarios = data.length; this.cargando = false; },
      error: () => { this.cargando = false; }
    });
    this.auditoriaService.getAll().subscribe({
      next: (data) => { this.totalLogs = data.length; }
    });
  }
}