import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar';
import { AuditoriaService } from '../../../services/api.service';
import { Auditoria } from '../../../models/models';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css'
})
export class AuditoriaComponent implements OnInit {

  logs: Auditoria[] = [];
  logsFiltrados: Auditoria[] = [];
  busqueda = '';
  filtroAccion = '';
  filtroTabla = '';
  cargando = true;
  paginaActual = 1;
  porPagina = 20;

  acciones: string[] = [];
  tablas: string[] = [];

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.auditoriaService.getAll().subscribe({
      next: (data) => {
        this.logs = data.sort((a, b) =>
          new Date(b.fechaHoraAudtria ?? '').getTime() -
          new Date(a.fechaHoraAudtria ?? '').getTime()
        );
        this.acciones = [...new Set(data.map(l => l.accionAudtria ?? '').filter(Boolean))];
        this.tablas   = [...new Set(data.map(l => l.tablaAfectada ?? '').filter(Boolean))];
        this.filtrar();
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  filtrar(): void {
    let lista = [...this.logs];
    if (this.busqueda.trim()) {
      const q = this.busqueda.toLowerCase();
      lista = lista.filter(l =>
        l.accionAudtria?.toLowerCase().includes(q) ||
        l.tablaAfectada?.toLowerCase().includes(q) ||
        l.ipCliente?.toLowerCase().includes(q) ||
        l.idUsuario?.toString().includes(q)
      );
    }
    if (this.filtroAccion) lista = lista.filter(l => l.accionAudtria === this.filtroAccion);
    if (this.filtroTabla)  lista = lista.filter(l => l.tablaAfectada === this.filtroTabla);
    this.logsFiltrados = lista;
    this.paginaActual = 1;
  }

  get logsPagina(): Auditoria[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.logsFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.logsFiltrados.length / this.porPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  colorAccion(accion?: string): string {
    if (!accion) return '#888';
    if (accion.includes('CREAR'))   return '#1D9E75';
    if (accion.includes('MODIFICAR') || accion.includes('ACTUALIZAR')) return '#534AB7';
    if (accion.includes('ELIMINAR')) return '#993C1D';
    if (accion.includes('LOGIN_EXITOSO'))  return '#0A2342';
    if (accion.includes('LOGIN_FALLIDO') || accion.includes('BLOQUEADO')) return '#E24B4A';
    if (accion.includes('DESBLOQUEAR'))   return '#F5C518';
    return '#888';
  }

  bgAccion(accion?: string): string {
    if (!accion) return '#f0f0f0';
    if (accion.includes('CREAR'))   return '#E8F8F2';
    if (accion.includes('MODIFICAR') || accion.includes('ACTUALIZAR')) return '#EEF3FE';
    if (accion.includes('ELIMINAR')) return '#FDECEA';
    if (accion.includes('LOGIN_EXITOSO'))  return '#EEF3FE';
    if (accion.includes('LOGIN_FALLIDO') || accion.includes('BLOQUEADO')) return '#FDECEA';
    if (accion.includes('DESBLOQUEAR'))   return '#FEF9E7';
    return '#f0f0f0';
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroAccion = '';
    this.filtroTabla = '';
    this.filtrar();
  }
}